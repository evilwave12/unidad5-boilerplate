import Button from '../../shared/components/Button';

function SelectionSummaryBanner({
  selectedDayObj,
  selectedSlot,
  clinic,
  reason = '',
  onReasonChange,
  onConfirm,
  disabled = false,
  loading = false,
}) {
  return (
    <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="border-l-4 border-med-primary-900 pl-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
            Resumen de Selección
          </span>
          <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
            <span>📅</span>
            <span>
              {selectedSlot
                ? `${selectedDayObj.fullDate}, ${selectedSlot.time} HS`
                : 'Seleccione un horario disponible'}
            </span>
          </p>
          <p className="text-xs text-med-text-sub mt-0.5">
            {clinic} • Duración: 30 min
          </p>
        </div>

        <Button
          type="button"
          disabled={disabled || loading}
          onClick={onConfirm}
          className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0 disabled:opacity-50"
        >
          <span>{loading ? 'Confirmando...' : 'Confirmar Turno'}</span>
          {!loading && (
            <svg
              className="w-5 h-5 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </Button>
      </div>

      {selectedSlot && (
        <div className="pt-3 border-t border-med-primary-200/60 flex flex-col sm:flex-row sm:items-center gap-2">
          <label
            htmlFor="appointment-reason"
            className="text-xs font-semibold text-med-primary-900 shrink-0"
          >
            Motivo de consulta:
          </label>
          <input
            id="appointment-reason"
            type="text"
            value={reason}
            onChange={(e) => onReasonChange?.(e.target.value)}
            disabled={loading}
            placeholder="Ej: Control médico general (opcional)"
            maxLength={200}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder:text-med-text-muted focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}

export default SelectionSummaryBanner;