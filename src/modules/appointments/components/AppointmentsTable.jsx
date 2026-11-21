import Card from '../../shared/components/Card';

const STATUS_CONFIG = {
  Booked: {
    label: 'CONFIRMADO',
    badgeClass: 'bg-med-active-bg text-med-active-text',
    dotClass: 'bg-med-active-text',
  },
  BOOKED: {
    label: 'CONFIRMADO',
    badgeClass: 'bg-med-active-bg text-med-active-text',
    dotClass: 'bg-med-active-text',
  },
  1: {
    label: 'CONFIRMADO',
    badgeClass: 'bg-med-active-bg text-med-active-text',
    dotClass: 'bg-med-active-text',
  },
  Completed: {
    label: 'COMPLETADO',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-500',
  },
  COMPLETED: {
    label: 'COMPLETADO',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-500',
  },
  3: {
    label: 'COMPLETADO',
    badgeClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-500',
  },
  Cancelled: {
    label: 'CANCELADO',
    badgeClass: 'bg-med-danger-bg text-med-danger-text',
    dotClass: 'bg-med-danger-text',
  },
  CANCELLED: {
    label: 'CANCELADO',
    badgeClass: 'bg-med-danger-bg text-med-danger-text',
    dotClass: 'bg-med-danger-text',
  },
  2: {
    label: 'CANCELADO',
    badgeClass: 'bg-med-danger-bg text-med-danger-text',
    dotClass: 'bg-med-danger-text',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return 'Sin fecha';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.slice(0, 5);
}

function AppointmentsTable({
  appointments,
  loading,
  error,
  fallbackDate,
  pageIndex,
  pageSize,
  totalCountAppointments,
  onPageChange,
  onSelectAppointment,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCountAppointments / pageSize));

  return (
    <Card className="p-0 overflow-hidden border-med-border">
      <div className="p-5 border-b border-med-border flex items-center justify-between">
        <h2 className="text-base font-bold text-med-primary-900">
          Registros de Citas
        </h2>
        {error && (
          <span className="text-xs text-red-600 font-medium">{error}</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
            <tr>
              <th className="px-6 py-3.5">Fecha</th>
              <th className="px-6 py-3.5">Departamento</th>
              <th className="px-6 py-3.5">Paciente</th>
              <th className="px-6 py-3.5 text-center">Estado</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-med-border-subtle">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-xs text-med-text-muted"
                >
                  Cargando citas...
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-xs text-med-text-muted"
                >
                  No se encontraron citas con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              appointments.map((item) => {
                const statusInfo = STATUS_CONFIG[item.appointmentsStatus] ?? {
                  label: String(item.appointmentsStatus ?? 'DESCONOCIDO'),
                  badgeClass: 'bg-slate-100 text-slate-700',
                  dotClass: 'bg-slate-500',
                };

                return (
                  <tr
                    key={item.appointmentsId}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Fecha y Hora */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-med-primary-900 text-sm">
                        {formatDate(item.slotDate ?? fallbackDate)}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        {formatTime(item.startTime)}
                      </p>
                    </td>

                    {/* Departamento / Especialidad */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.75"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-med-primary-900">
                            {item.doctor?.specialty?.specialtyName ?? '—'}
                          </p>
                          <p className="text-xs text-med-text-muted">
                            {item.doctor?.name ?? '—'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Paciente y DNI */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-med-text-main">
                        {item.patient?.fullName ?? '—'}
                      </p>
                      <p className="text-xs text-med-text-muted mt-0.5">
                        DNI: {item.patient?.dni ?? '—'}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                        />
                        {statusInfo.label}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectAppointment?.(item)}
                        className="text-xs font-semibold text-med-primary-700 hover:text-med-primary-900 transition hover:underline"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginador inferior */}
      <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
        <span className="flex items-center gap-1">
          Mostrando {appointments.length} de {totalCountAppointments} registros
          (Página {pageIndex} de {totalPages})
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pageIndex <= 1 || loading}
            onClick={() => onPageChange(Math.max(1, pageIndex - 1))}
            className="w-9 h-9 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-3xl leading-none pb-0.5 hover:bg-gray-50 disabled:opacity-50"
          >
            ‹
          </button>
          <button
            type="button"
            disabled={pageIndex >= totalPages || loading}
            onClick={() => onPageChange(Math.min(totalPages, pageIndex + 1))}
            className="w-9 h-9 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-3xl leading-none pb-0.5 hover:bg-gray-50 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </Card>
  );
}

export default AppointmentsTable;