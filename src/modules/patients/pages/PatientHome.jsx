import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';

import { SpecialtiesService } from '../../specialties/services/SpecialtiesService';
import { AvailabilityService } from '../../doctors/services/AvailabilityService';

import SpecialtyDoctorSelector from '../components/SpecialtyDoctorSelector';
import DoctorInformation from '../components/DoctorInformation';
import AvailabilitySelector from '../components/AvailabilitySelector';
import SelectionBanner from '../components/SelectionBanner';

const DAY_NAMES_SHORT = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];
const DAY_NAMES_FULL = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
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

const DAY_OF_WEEK_MAP = {
  0: 0,
  sunday: 0,
  domingo: 0,
  1: 1,
  monday: 1,
  lunes: 1,
  2: 2,
  tuesday: 2,
  martes: 2,
  3: 3,
  wednesday: 3,
  miercoles: 3,
  miércoles: 3,
  4: 4,
  thursday: 4,
  jueves: 4,
  5: 5,
  friday: 5,
  viernes: 5,
  6: 6,
  saturday: 6,
  sabado: 6,
  sábado: 6,
};

const toDateKey = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDays = (weekOffset = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay();

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
      dayName: DAY_NAMES_SHORT[index],
      dateNumber: String(dayNum).padStart(2, '0'),
      monthShort: MONTH_NAMES[monthIndex].slice(0, 3).toUpperCase(),
      monthName: MONTH_NAMES[monthIndex],
      fullDate: `${DAY_NAMES_FULL[index]} ${dayNum} de ${MONTH_NAMES[monthIndex]} de ${year}`,
    };
  });
};

const extractTime = (rawTime) => {
  if (!rawTime) return '';
  const str = String(rawTime);
  if (str.includes('T')) {
    return str.split('T')[1].slice(0, 5);
  }
  return str.slice(0, 5);
};

const resolveDateKey = (slot, referenceWeekDays) => {
  const av = slot._availability || {};
  const startStr = String(slot.startTime || '');

  const rawDate =
    slot.date ??
    slot.day ??
    slot.slotDate ??
    slot.startDate ??
    (startStr.includes('T') ? startStr : null) ??
    av.date ??
    av.day;

  if (rawDate) {
    const str = String(rawDate).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      return str.slice(0, 10);
    }
    const parsed = new Date(str);
    if (!Number.isNaN(parsed.getTime())) {
      return toDateKey(parsed);
    }
  }

  // Fallback si la disponibilidad usa dayOfWeek (0-6 o nombre del día) sin fecha puntual
  const rawDayOfWeek = slot.dayOfWeek ?? av.dayOfWeek;
  if (rawDayOfWeek !== undefined && rawDayOfWeek !== null) {
    const normalizedKey =
      typeof rawDayOfWeek === 'number'
        ? rawDayOfWeek
        : String(rawDayOfWeek).trim().toLowerCase();
    const dayIndex = DAY_OF_WEEK_MAP[normalizedKey];
    if (dayIndex !== undefined && referenceWeekDays[dayIndex]) {
      return referenceWeekDays[dayIndex].dateKey;
    }
  }

  return '';
};

const getWeekOffsetForDateKey = (dateKey) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - today.getDay());

  const [year, month, day] = dateKey.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const targetSunday = new Date(targetDate);
  targetSunday.setDate(targetDate.getDate() - targetDate.getDay());

  const diffWeeks = Math.round(
    (targetSunday.getTime() - currentSunday.getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  );
  return Math.max(0, diffWeeks);
};

const buildSlotsByDay = (weekDays, rawSlots) => {
  const grouped = {};
  weekDays.forEach((day) => {
    grouped[day.dateKey] = rawSlots
      .filter((slot) => slot.dateKey === day.dateKey)
      .sort((a, b) => a.time.localeCompare(b.time));
  });
  return grouped;
};

const getActiveDoctors = (specialty) =>
  (specialty?.doctors ?? []).filter((doc) => doc.isActive !== false);

function PatientHome() {
  const navigate = useNavigate();

  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const [weekOffset, setWeekOffset] = useState(0);
  const [rawSlots, setRawSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedDayKey, setSelectedDayKey] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedModal, setConfirmedModal] = useState(false);

  const weekDays = getWeekDays(weekOffset);

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
  const weekRangeLabel =
    firstDay.monthName === lastDay.monthName
      ? `Domingo ${Number(firstDay.dateNumber)} - Sábado ${Number(lastDay.dateNumber)}, ${firstDay.monthName}`
      : `Domingo ${Number(firstDay.dateNumber)} ${firstDay.monthShort} - Sábado ${Number(lastDay.dateNumber)} ${lastDay.monthShort}`;

  // 1. Carga inicial usando ResponseWithDoctors (api/specialties/withDoctors)
  useEffect(() => {
    const fetchSelectorData = async () => {
      try {
        setLoading(true);
        const specialtiesData =
          await SpecialtiesService.getSpecialtiesWithDoctors();
        setSpecialties(specialtiesData);

        if (specialtiesData.length > 0) {
          const firstSpecialty = specialtiesData[0];
          setSelectedSpecialtyId(firstSpecialty.id);

          const activeDocs = getActiveDoctors(firstSpecialty);
          setSelectedDoctorId(activeDocs[0]?.id ?? '');
        }
      } catch (error) {
        console.error('Error cargando especialidades con doctores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectorData();
  }, []);

  // Especialidad y doctores derivados directamente del DTO ResponseWithDoctors
  const currentSpecialty =
    specialties.find((spec) => spec.id === selectedSpecialtyId) || null;

  const filteredDoctors = getActiveDoctors(currentSpecialty);

  const currentDoctor =
    filteredDoctors.find((doc) => doc.id === selectedDoctorId) ||
    filteredDoctors[0] ||
    null;

  // Asegura que doctor.specialty.name exista para DoctorInformation y el Modal
  const doctorWithSpecialty = currentDoctor
    ? {
        ...currentDoctor,
        specialty: currentDoctor.specialty ?? {
          specialtyId: currentSpecialty?.id,
          name: currentSpecialty?.name,
        },
      }
    : null;

  const fetchDoctorSlots = async (doctorId) => {
    if (!doctorId) {
      setRawSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      const data = await AvailabilityService.getSlotsByDoctor(doctorId);
      const baseWeekDays = getWeekDays(0);

      const normalized = data
        .filter(
          (slot) =>
            slot.isAvailable !== false &&
            slot.isBooked !== true &&
            slot.isActive !== false
        )
        .map((slot, index) => ({
          id: slot.id ?? `${slot.availabilityId || 'slot'}-${index}`,
          availabilityId: slot.availabilityId ?? slot._availability?.id,
          dateKey: resolveDateKey(slot, baseWeekDays),
          time: extractTime(slot.startTime ?? slot.time),
          endTime: extractTime(slot.endTime),
        }))
        .filter((slot) => slot.dateKey && slot.time);

      setRawSlots(normalized);

      // Si no hay slots en la semana actual pero sí en semanas futuras, salta a esa semana
      const currentWeekHasSlots = baseWeekDays.some((day) =>
        normalized.some((s) => s.dateKey === day.dateKey)
      );

      if (!currentWeekHasSlots && normalized.length > 0) {
        const sortedDateKeys = normalized
          .map((s) => s.dateKey)
          .sort((a, b) => a.localeCompare(b));
        setWeekOffset(getWeekOffsetForDateKey(sortedDateKeys[0]));
      } else {
        setWeekOffset(0);
      }
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

  const selectedDayObj =
    weekDays.find((d) => d.dateKey === selectedDayKey) || weekDays[0];

  const handleSpecialtyChange = (newSpecialtyId) => {
    setSelectedSpecialtyId(newSpecialtyId);
    const chosenSpecialty = specialties.find(
      (spec) => spec.id === newSpecialtyId
    );
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

      <DoctorInformation doctor={doctorWithSpecialty} loading={loading} />

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
        disable={!selectedSlot || !doctorWithSpecialty}
      />

      {confirmedModal && doctorWithSpecialty && selectedSlot && (
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
                Dr/a. {doctorWithSpecialty.name}
              </strong>{' '}
              ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {selectedDayObj.fullDate} a las {selectedSlot.time} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong>{' '}
                {doctorWithSpecialty.specialty?.name}
              </p>
              <p>
                <strong>Matrícula:</strong> {doctorWithSpecialty.licenseNumber}
              </p>
              <p>
                <strong>Paciente:</strong> Johnathan Doe (DNI: 40.123.456)
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