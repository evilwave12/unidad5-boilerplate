import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import SpecialtyDoctorSelector from '../components/SpecialtyDoctorSelector';
import DoctorInformation from '../components/DoctorInformation';
import AvailabilitySelector from '../components/AvailabilitySelector';
import SelectionBanner from '../components/SelectionBanner';

const DOCTORS_LIST = [
  {
    id: 'doc-1',
    name: 'Dr. Alejandro Martínez',
    specialty: 'Cardiología',
    specialtyDetail: 'Cardiología Intervencionista',
    clinic: 'Clínica San Rafael • Sede Central Consultorio 402',
    badge: 'Verificado',
    avatar: '👨‍⚕️',
  },
  {
    id: 'doc-2',
    name: 'Dra. Elena Martínez',
    specialty: 'Pediatría',
    specialtyDetail: 'Pediatría Avanzada',
    clinic: 'Clínica San Rafael • Consultorio 104',
    badge: 'Verificado',
    avatar: '👩‍⚕️',
  },
  {
    id: 'doc-3',
    name: 'Dr. Marcos Torres',
    specialty: 'Neurología',
    specialtyDetail: 'Neurocirugía Clínica',
    clinic: 'Clínica San Rafael • Consultorio 202',
    badge: 'Verificado',
    avatar: '👨‍⚕️',
  },
];

const WEEK_DAYS = [
  { dayName: 'LUN', dateNumber: '22', fullDate: 'Lunes 22 de Mayo de 2024' },
  { dayName: 'MAR', dateNumber: '23', fullDate: 'Martes 23 de Mayo de 2024' },
  { dayName: 'MIE', dateNumber: '24', fullDate: 'Miércoles 24 de Mayo de 2024' },
  { dayName: 'JUE', dateNumber: '25', fullDate: 'Jueves 25 de Mayo de 2024' },
  { dayName: 'VIE', dateNumber: '26', fullDate: 'Viernes 26 de Mayo de 2024' },
];

const SLOTS_BY_DAY = {
  22: ['08:00', '08:30', '09:00', '09:30', '10:00', '11:30'],
  23: ['08:00', '09:00', '10:30', '11:00', '12:30'],
  24: ['08:30', '09:30', '11:00', '11:30'],
  25: [],
  26: ['08:00', '08:30', '09:00', '14:00', '14:30'],
};

function PatientHome() {
  const navigate = useNavigate();

  const [selectedSpecialty, setSelectedSpecialty] = useState('Cardiología');
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1');
  const [selectedDayNumber, setSelectedDayNumber] = useState('22');
  const [selectedSlot, setSelectedSlot] = useState('09:30');
  const [confirmedModal, setConfirmedModal] = useState(false);

  const filteredDoctors = DOCTORS_LIST.filter(
    (doc) => doc.specialty === selectedSpecialty
  );

  const currentDoctor =
    DOCTORS_LIST.find((doc) => doc.id === selectedDoctorId) ||
    filteredDoctors[0] ||
    DOCTORS_LIST[0];

  const selectedDayObj =
    WEEK_DAYS.find((d) => d.dateNumber === selectedDayNumber) || WEEK_DAYS[0];

  const handleSpecialtyChange = (newSpecialty) => {
    setSelectedSpecialty(newSpecialty);
    const firstMatch = DOCTORS_LIST.find(
      (doc) => doc.specialty === newSpecialty
    );
    if (firstMatch) {
      setSelectedDoctorId(firstMatch.id);
    }
  };

  const handleSelectSlot = (dayNum, slot) => {
    setSelectedDayNumber(dayNum);
    setSelectedSlot(slot);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <SpecialtyDoctorSelector
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={handleSpecialtyChange}
        doctors={filteredDoctors.length > 0 ? filteredDoctors : DOCTORS_LIST}
        selectedDoctorId={selectedDoctorId}
        onDoctorChange={setSelectedDoctorId}
        onSearch={() => {}}
      />

      <DoctorInformation doctor={currentDoctor} />

      <AvailabilitySelector
        weekDays={WEEK_DAYS}
        slotsByDay={SLOTS_BY_DAY}
        selectedDayNumber={selectedDayNumber}
        selectedSlot={selectedSlot}
        onSelectDay={setSelectedDayNumber}
        onSelectSlot={handleSelectSlot}
      />

      <SelectionBanner
        selectedDayObj={selectedDayObj}
        selectedSlot={selectedSlot}
        clinic={currentDoctor.clinic}
        onConfirm={() => setConfirmedModal(true)}
      />

      {confirmedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-xl font-bold text-med-primary-900">
              ¡Turno Confirmado con Éxito!
            </h3>
            <p className="text-xs text-med-text-sub mt-2 leading-relaxed">
              Tu turno con el{' '}
              <strong className="text-med-text-main">
                {currentDoctor.name}
              </strong>{' '}
              ha sido reservado para el{' '}
              <strong className="text-med-text-main">
                {selectedDayObj.fullDate} a las {selectedSlot} hs
              </strong>
              .
            </p>

            <div className="mt-5 p-3.5 bg-med-primary-50 border border-med-primary-200/60 rounded-xl text-xs text-med-primary-900 text-left space-y-1">
              <p>
                <strong>Especialidad:</strong> {currentDoctor.specialtyDetail}
              </p>
              <p>
                <strong>Lugar:</strong> {currentDoctor.clinic}
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