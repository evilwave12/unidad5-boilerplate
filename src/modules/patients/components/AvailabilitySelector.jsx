import Card from '../../shared/components/Card';

function AvailabilitySelector({
  weekDays,
  weekRangeLabel,
  slotsByDay,
  selectedDayKey,
  selectedSlotId,
  onSelectDay,
  onSelectSlot,
  onPrevWeek,
  onNextWeek,
  canGoPrev = false,
  loading = false,
}) {
  const selectedDaySlots = slotsByDay[selectedDayKey] || [];

  return (
    <Card className="p-5 sm:p-6 border-med-border">
      {/* Cabecera del calendario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevWeek}
            disabled={!canGoPrev || loading}
            className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
          >
            ‹
          </button>
          <span className="font-bold text-sm sm:text-base text-med-primary-900">
            {weekRangeLabel}
          </span>
          <button
            type="button"
            onClick={onNextWeek}
            disabled={loading}
            className="p-1 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition"
          >
            ›
          </button>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs text-med-text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-med-primary-900" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Seleccionado
          </span>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-med-text-muted">
          Cargando horarios disponibles...
        </div>
      ) : (
        <>
          {/* VISTA DESKTOP */}
          <div className="hidden sm:grid sm:grid-cols-7 gap-3 pt-5">
            {weekDays.map((day) => {
              const slots = slotsByDay[day.dateKey] || [];

              return (
                <div
                  key={day.dateKey}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-med-text-sub uppercase">
                      {day.dayName}
                    </span>
                    <p className="text-xl font-bold text-med-primary-900 leading-tight">
                      {day.dateNumber}
                    </p>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    {slots.length > 0 ? (
                      slots.map((slot) => {
                        const isSelected =
                          selectedDayKey === day.dateKey &&
                          selectedSlotId === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => onSelectSlot(day.dateKey, slot)}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                                : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })
                    ) : (
                      <div className="h-44 flex items-center justify-center text-center p-2">
                        <p className="text-xs text-med-text-muted leading-relaxed">
                          No hay turnos disponibles para este día.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* VISTA MOBILE */}
          <div className="block sm:hidden pt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-med-text-main">
                  Próximos Turnos
                </span>
                <span className="text-xs font-semibold text-med-primary-700">
                  Ver más ›
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {weekDays.map((day) => {
                  const isActive = selectedDayKey === day.dateKey;

                  return (
                    <button
                      key={day.dateKey}
                      type="button"
                      onClick={() => {
                        onSelectDay(day.dateKey);
                        const availableSlots = slotsByDay[day.dateKey] || [];
                        if (
                          availableSlots.length > 0 &&
                          !availableSlots.some((s) => s.id === selectedSlotId)
                        ) {
                          onSelectSlot(day.dateKey, availableSlots[0]);
                        }
                      }}
                      className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                        isActive
                          ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                          : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-sub'
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="block text-base font-extrabold my-0.5">
                        {day.dateNumber}
                      </span>
                      <span
                        className={`block text-[10px] uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-muted'
                        }`}
                      >
                        {day.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-med-text-sub mb-2.5">
                Horarios disponibles (Bloques de 30 min)
              </span>

              {selectedDaySlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {selectedDaySlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onSelectSlot(selectedDayKey, slot)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
                            : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        {slot.time} HS
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
                  <p className="text-xs text-med-text-muted">
                    No hay turnos disponibles para este día seleccionado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default AvailabilitySelector;
