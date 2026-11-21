import Button from '../../shared/components/Button';

function SelectionSummaryBanner({
  selectedDayObj,
  selectedSlot,
  clinic,
  onConfirm,
  disabled = false,
}) {
  return (
    <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        disable={disabled}
        onClick={onConfirm}
        className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0"
      >
        <span>Confirmar Turno</span>
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
      </Button>
    </div>
  );
}

export default SelectionSummaryBanner;
