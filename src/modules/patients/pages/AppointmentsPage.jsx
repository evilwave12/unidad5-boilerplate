import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import AppointmentCard from '../components/AppointmentCard';
import { AppointmentService } from '../../appointments/services/AppointmentService';
import useAuth  from '../../auth/hook/useAuth'; 


function AppointmentsPage() {
  const navigate = useNavigate();
  const {dni} = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if(!dni) return;
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await AppointmentService.getPatientAppointments(
          TEST_PATIENT_DNI
        );
        setAppointments(data);
      } catch (err) {
        console.error('Error al cargar los turnos del paciente:', err);
        setError('No se pudieron cargar tus turnos médicos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [dni]);

  const handleCancel = async (appointment) => {
    const id = appointment.appointmentId;
    if (!id) return;

    const confirmed = window.confirm(
      `¿Confirmás la cancelación del turno con ${appointment.doctorName}?`
    );
    if (!confirmed) return;

    try {
      setCancellingId(id);
      await AppointmentService.cancelAppointment(id);
      setAppointments((prev) =>
        prev.filter((item) => item.appointmentId !== id)
      );
    } catch (err) {
      console.error('Error al cancelar el turno:', err);
      alert('No se pudo cancelar el turno.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>

        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {loading ? (
        <Card className="p-8 text-center text-sm text-med-text-sub">
          Cargando tus turnos médicos...
        </Card>
      ) : error ? (
        <Card className="p-6 text-center text-sm text-red-600">{error}</Card>
      ) : appointments.length === 0 ? (
        <Card className="p-8 text-center flex flex-col items-center gap-3">
          <p className="text-sm text-med-text-sub">
            No tenés turnos médicos activos programados.
          </p>
          <Button onClick={() => navigate('/')}>Reservar un Turno</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.appointmentId}
              appointment={appt}
              cancelling={cancellingId === appt.appointmentId}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;