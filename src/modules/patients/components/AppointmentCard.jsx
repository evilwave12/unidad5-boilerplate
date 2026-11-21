import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AppointmentCard({ appointment, onCancel, cancelling = false }) {
  const id = appointment.appointmentId;
  const start = String(appointment.startDateTime);
  const end = String(appointment.endDateTime);

  /*const handleCancel = () => {
    if (onCancel) {
      onCancel(appointment.id);
    }
  };*/

  return (
    <Card className="flex flex-col justify-between gap-4 p-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
            Turno Médico
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Confirmado
          </span>

          <h3 className="text-lg font-bold text-med-primary-900">
            {appointment.doctorName}
          </h3>

          <p className="text-sm text-med-text-sub mt-2">
            Horario:{''}
            <strong className="text-med-text-main font-semibold">
              {start}
              {end ? '-' + { end } : ''}hs
            </strong>
          </p>
        </div>
        <div className="flex gap-2 pt-3 border-t border-med-border">
          <Button
            variant="outline"
            className="w-full text-xs"
            disable={!id||cancelling}
            onClick={() => onCancel(appointment)}
          >
            Cancelar Turno
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AppointmentCard;