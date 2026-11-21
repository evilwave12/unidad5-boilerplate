import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';

//import { DoctorsService } from '../../doctors/services/DoctorsService';
import { SpecialtiesService } from '../../specialties/services/SpecialtiesService';
import { AvailabilityService } from '../../doctors/services/AvailabilityService';

import SpecialtyDoctorSelector from '../components/SpecialtyDoctorSelector';
import DoctorInformation from '../components/DoctorInformation';
import AvailabilitySelector from '../components/AvailabilitySelector';
import SelectionBanner from '../components/SelectionBanner';

const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const DAY_FULL_NAME = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
];
const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const toDateKey = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth + 1);
  const day = String(dateObj.getDate());
  return year + '-' + month + '-' + day;
};

const getWeekDays = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sab

  const sunday = new Date(today);
  sunday.setHours(0, 0, 0, 0);
  sunday.setDate(today.getDate() - dayOfWeek + weekOffset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(sunday);
    current.setDate(sunday.getDate() + index);

    const dayNum = current.getDate();
    const monthIndex = current.getMonth();
    const year = current.getFullYear();

    return {
      dateKey: toDateKey(current),
      dayName: DAY_NAMES[index],
      dateNumber: String(dayNum).padStart(2, '0'),
      monthShort: MONTH_NAMES[monthIndex].slice(0, 3).toUpperCase(),
      monthName: MONTH_NAMES[monthIndex],
      fullDate: `${DAY_FULL_NAME[index]} ${dayNum} de ${MONTH_NAMES[monthIndex]} de ${year}`,
    };
  });
};

//sacada de IA
const buildSlotsByDay = (weekDays, rawSlots) => {
  const grouped = {};
  weekDays.forEach((day) => {
    grouped[day.dateKey] = rawSlots
      .filter((slot) => slot.dateKey === day.dateKey)
      .sort((a, b) => a.time.localeCompare(b.time));
  });
  return grouped;
};

const getActiveDoctors = (specialty) => (specialty?.doctors ?? []).filter((doc) => doc.isActive !== false);

function PatientHome() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(
    'Seleccione una especialidad'
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    'Seleccione un doctor'
  );

  const [weekOffset, setWeekOffset] = useState(0);
  const [rawSlots, setRawSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedDayKey, setSelectedDayKey] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedModal, setConfirmedModal] = useState(false);

  const weekDays = getWeekDays(weekOffset);

  const firstDay = weekDays[0]; // Domingo
  const lastDay = weekDays[6]; // Sábado

  const weekRangeLabel =
    firstDay.monthName === lastDay.monthName
      ? 'Domingo ' +
        Number(firstDay.dateNumber) +
        ' - Sábado ' +
        Number(lastDay.dateNumber) +
        ', ' +
        firstDay.monthName
      : 'Domingo ' +
        Number(firstDay.dateNumber) +
        ' ' +
        firstDay.monthShort +
        ' - Sábado ' +
        Number(lastDay.dateNumber) +
        ' ' +
        lastDay.monthShort;

  useEffect(() => {
    const fetchSelectorData = async () => {
      try {
        setLoading(true);
        const specialtiesData = await SpecialtiesService.getSpecialtiesWithDoctors();
        setSpecialties(specialtiesData);

        if (specialtiesData.length > 0) {
          const firstSpecialty = specialtiesData[0];
          setSelectedSpecialtyId(firstSpecialty.id);

          const activeDocs = getActiveDoctors(firstSpecialty);
          setSelectedDoctorId(activeDocs[0]?.id ?? '');
        }
      } catch (error) {
        console.error('Error cargando especialidades o doctores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectorData();
  }, []);

  const currentSpecialty = specialties.find((spec) => spec.id === selectedSpecialtyId) || null;
  const filteredDoctors = getActiveDoctors(currentSpecialty);

  const currentDoctor = filteredDoctors.find((doc) => doc.id === selectedDoctorId) || filteredDoctors[0] || null;

<<<<<<< HEAD
  const fetchDoctorSlots = async (doctorId) => {
    if (!doctorId) {
      setRawSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      const data = await AvailabilityService.getSlotsByDoctor(doctorId);

      // Mapea el DTO ResponseAvailabilitySlots(id, day, startTime, endTime)
      const normalized = data.map((slot) => ({
        id: slot.id,
        dateKey: String(slot.day).slice(0, 10), // "YYYY-MM-DD"
        time: String(slot.startTime).slice(0, 5), // "HH:mm"
        endTime: String(slot.endTime).slice(0, 5),
      }));

      setRawSlots(normalized);
    } catch (error) {
      console.error('Error cargando slots de disponibilidad:', error);
      setRawSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // 2. Trae los slots reales cada vez que cambia el doctor seleccionado
  useEffect(() => {
    fetchDoctorSlots(currentDoctor?.id);
  }, [currentDoctor?.id]);

  const slotsByDay = buildSlotsByDay(weekDays, rawSlots);

  // 3. Selecciona automáticamente el primer turno disponible al cambiar de semana o recibir nuevos slots
  useEffect(() => {
    const currentWeekDays = getWeekDays(weekOffset);
    const currentSlotsByDay = buildSlotsByDay(currentWeekDays, rawSlots);

    const firstDayWithSlots = currentWeekDays.find(
      (day) => (currentSlotsByDay[day.dateKey] || []).length > 0
    );

    if (firstDayWithSlots) {
      setSelectedDayKey(firstDayWithSlots.dateKey);
      setSelectedSlot(currentSlotsByDay[firstDayWithSlots.dateKey][0]);
    } else {
      setSelectedDayKey(currentWeekDays[0]?.dateKey || '');
      setSelectedSlot(null);
    }
  }, [weekOffset, rawSlots]);

=======
  const doctorWithSpecialty = currentDoctor ? {...currentDoctor,specialty:currentDoctor.specialty??
    {specialtyId: currentSpecialty?.id,name:currentSpecialty?.name,},
  }:null;
  
>>>>>>> 4cf41910c55a317cedb6cc33fcd21af835f0b842
  const selectedDayObj =
    weekDays.find((d) => d.dateKey === selectedDayKey) || weekDays[0];

  const handleSpecialtyChange = (newSpecialtyId) => {
    setSelectedSpecialtyId(newSpecialtyId);
    const chosenSpecialty = specialties.find((spec) => spec.id === newSpecialtyId);
    const activeDocs = getActiveDoctors(chosenSpecialty);
    setSelectedDoctorId(activeDocs[0]?.id ?? '');
  };

  const handleSelectSlot = (dayKey, slotObj) => {
    setSelectedDayKey(dayKey);
    setSelectedSlot(slotObj);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <SpecialtyDoctorSelector
        specialties={specialties}
        selectedSpecialtyId={selectedSpecialtyId}
        onSpecialtyChange={handleSpecialtyChange}
        doctors={filteredDoctors}
        selectedDoctorId={selectedDoctorId}
        onDoctorChange={setSelectedDoctorId}
        onSearch={() => fetchDoctorSlots(currentDoctor?.id)}
        loading={loading}
      />

      <DoctorInformation doctor={currentDoctor} loading={loading} />

      <AvailabilitySelector
        weekDays={weekDays}
        weekRangeLabel={weekRangeLabel}
        slotsByDay={slotsByDay}
        selectedDayKey={selectedDayKey}
        selectedSlotId={selectedSlot?.id}
        onSelectDay={setSelectedDayKey}
        onSelectSlot={handleSelectSlot}
        onPrevWeek={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
        onNextWeek={() => setWeekOffset((prev) => prev + 1)}
        canGoPrev={weekOffset > 0}
        loading={loadingSlots}
      />

      <SelectionBanner
        selectedDayObj={selectedDayObj}
        selectedSlot={selectedSlot}
        clinic={
          doctorWithSpecialty?.clinic ||
          'Clínica San Rafael • Sede Central Consultorio 402'
        }
        onConfirm={() => setConfirmedModal(true)}
        disabled={!selectedSlot || !currentDoctor}
      />

<<<<<<< HEAD
      {confirmedModal && currentDoctor && selectedSlot && (
=======
      {confirmedModal && doctorWithSpecialty && (
>>>>>>> 4cf41910c55a317cedb6cc33fcd21af835f0b842
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con{' '}
              <strong className="text-med-text-main">
                Dr/a. {currentDoctor.name}
              </strong>{' '}
              ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {selectedDayObj.fullDate} a las {selectedSlot.time} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong> {doctorWithSpecialty.specialty?.name}
              </p>
              <p>
                <strong>Matrícula:</strong> {doctorWithSpecialty.licenseNumber}
              </p>
              <p>
                <strong>Paciente:</strong> Johnathan Doe (DNI: 40.123.456) {/* ACA HAY QUE CAMBIAR ESTOS DATOS DE PACIENTE:P */}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="w-full text-xs py-2.5"
                onClick={() => navigate('/appointments')}
              >
                Ver Mis Turnos
              </Button>
              <Button
                variant="secondary"
                className="w-full text-xs py-2.5"
                onClick={() => setConfirmedModal(false)}
              >
                Reservar Otro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
