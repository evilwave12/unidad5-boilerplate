import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';

import { SpecialtiesService } from '../../specialties/services/SpecialtiesService';
import { AvailabilityService } from '../../doctors/services/AvailabilityService';
import { AppointmentService } from '../../appointments/services/AppointmentService';
import useAuth from '../../auth/hook/useAuth';

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

const toDateKey = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
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
      fullDate:
        DAY_NAMES_FULL[index] +
        ' ' +
        dayNum +
        ' de ' +
        MONTH_NAMES[monthIndex] +
        ' de ' +
        year,
    };
  });
};

const getWeekOffsetForDateKey = (dateKey) => {
  for (let offset = 0; offset < 52; offset++) {
    if (getWeekDays(offset).some((day) => day.dateKey === dateKey)) {
      return offset;
    }
  }
  return 0;
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
  const auth = useAuth();
  const dni = auth?.dni;

  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');

  const [weekOffset, setWeekOffset] = useState(0);
  const [rawSlots, setRawSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [selectedDayKey, setSelectedDayKey] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const weekDays = getWeekDays(weekOffset);

  const firstDay = weekDays[0];
  const lastDay = weekDays[6];
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

  // carga inicial usando ResponseWithDoctors (api/specialties/withDoctors)
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

  const currentSpecialty =
    specialties.find((spec) => spec.id === selectedSpecialtyId) || null;

  const filteredDoctors = getActiveDoctors(currentSpecialty);

  const currentDoctor =
    filteredDoctors.find((doc) => doc.id === selectedDoctorId) ||
    filteredDoctors[0] ||
    null;

  const doctorWithSpecialty = currentDoctor
    ? {
        ...currentDoctor,
        specialty: currentDoctor.specialty ?? {
          specialtyId: currentSpecialty?.id,
          name: currentSpecialty?.name,
        },
      }
    : null;

  const fetchDoctorSlots = async (doctorId, preserveWeek = false) => {
    if (!doctorId) {
      setRawSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      const data = await AvailabilityService.getSlotsByDoctor(doctorId);

      const normalized = data
        .map((slot) => ({
          id: slot.id,
          dateKey: String(slot.day ?? '').slice(0, 10),
          time: String(slot.startTime ?? '').slice(0, 5),
          endTime: String(slot.endTime ?? '').slice(0, 5),
        }))
        .filter((slot) => slot.dateKey && slot.time);

      setRawSlots(normalized);

      if (!preserveWeek) {
        const baseWeekDays = getWeekDays(0);
        const currentWeekHasSlots = baseWeekDays.some((day) =>
          normalized.some((s) => s.dateKey === day.dateKey)
        );

        if (!currentWeekHasSlots && normalized.length > 0) {
          const sortedDates = normalized
            .map((s) => s.dateKey)
            .sort((a, b) => a.localeCompare(b));
          setWeekOffset(getWeekOffsetForDateKey(sortedDates[0]));
        } else {
          setWeekOffset(0);
        }
      }
    } catch (error) {
      console.error('Error cargando slots de disponibilidad:', error);
      setRawSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // trae los slots reales cada vez que cambia el doctor seleccionado
  useEffect(() => {
    setBookingError('');
    fetchDoctorSlots(currentDoctor?.id, false);
  }, [currentDoctor?.id]);

  const slotsByDay = buildSlotsByDay(weekDays, rawSlots);

  // selecciona automáticamente el primer turno disponible al cambiar de semana o recibir nuevos slots
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
    setBookingError('');
    setSelectedDayKey(dayKey);
    setSelectedSlot(slotObj);
  };

  const handleConfirmAppointment = async () => {
    if (!selectedSlot || !doctorWithSpecialty || submitting) return;

    if (!dni) {
      setBookingError(
        'No se encontró el DNI del paciente en la sesión actual. Iniciá sesión nuevamente.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setBookingError('');

      const finalReason = reason.trim() || 'Consulta médica';

      const appointmentPayload = {
        doctorId: doctorWithSpecialty.id,
        availabilitySlotId: selectedSlot.id,
        patient: {
          dni: String(dni),
        },
        reason: finalReason,
      };

      const created =
        await AppointmentService.createAppointment(appointmentPayload);

      setConfirmedBooking({
        doctor: doctorWithSpecialty,
        day: selectedDayObj,
        slot: selectedSlot,
        dni: String(dni),
        reason: finalReason,
        appointment: created,
      });

      setReason('');
      await fetchDoctorSlots(doctorWithSpecialty.id, true);
    } catch (error) {
      console.error('Error al reservar el turno:', error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.response?.data?.title ||
        'No se pudo confirmar el turno. Verificá si el horario sigue disponible.';
      setBookingError(errorMsg);
    } finally {
      setSubmitting(false);
    }
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
        onSearch={() => fetchDoctorSlots(currentDoctor?.id, false)}
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

      {bookingError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {bookingError}
        </div>
      )}

      <SelectionBanner
        selectedDayObj={selectedDayObj}
        selectedSlot={selectedSlot}
        clinic={
          doctorWithSpecialty?.clinic ||
          'Clínica San Rafael • Sede Central Consultorio 402'
        }
        reason={reason}
        onReasonChange={setReason}
        onConfirm={handleConfirmAppointment}
        disabled={!selectedSlot || !doctorWithSpecialty}
        loading={submitting}
      />

      {confirmedBooking && (
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
                Dr/a. {confirmedBooking.doctor.name}
              </strong>{' '}
              ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {confirmedBooking.day.fullDate} a las{' '}
                {confirmedBooking.slot.time} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong>{' '}
                {confirmedBooking.doctor.specialty?.name}
              </p>
              <p>
                <strong>Matrícula:</strong>{' '}
                {confirmedBooking.doctor.licenseNumber}
              </p>
              <p>
                <strong>Paciente (DNI):</strong> {confirmedBooking.dni}
              </p>
              <p>
                <strong>Motivo:</strong> {confirmedBooking.reason}
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
                onClick={() => setConfirmedBooking(null)}
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