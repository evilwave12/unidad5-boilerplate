import Card from '../../../shared/components/Card';
import Button from '../../../shared/components/Button';

function AppointmentsFilterForm({
  filters,
  appliedFilters,
  specialties,
  doctors,
  loading,
  lastUpdated,
  onInputChange,
  onApplyFilters,
  onClearFilters,
  onRemoveSingleFilter,
}) {
  const selectedSpecialty = specialties.find(
    (s) => String(s.specialtyId ?? s.id) === String(appliedFilters.specialtyId)
  );
  const selectedSpecialtyName =
    selectedSpecialty?.specialtyName ?? selectedSpecialty?.name;

  const selectedDoctorName = doctors.find(
    (d) => String(d.doctorId ?? d.id) === String(appliedFilters.doctorId)
  )?.name;

  const hasActiveFilters = Object.values(appliedFilters).some(Boolean);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
        <h2 className="text-base font-bold text-med-primary-900">
          Criterios de Búsqueda
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-med-text-muted">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Última actualización: {lastUpdated}</span>
        </div>
      </div>

      <form
        onSubmit={onApplyFilters}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4 items-end"
      >
        {/* DNI del Paciente */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            DNI del Paciente
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={filters.dni}
              onChange={(e) => onInputChange('dni', e.target.value)}
              placeholder="DNI sin puntos..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>
        </div>

        {/* Especialidad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Especialidad
          </label>
          <select
            value={filters.specialtyId}
            onChange={(e) => onInputChange('specialtyId', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          >
            <option value="">Todas las Especialidades</option>
            {specialties.map((spec) => {
              const id = spec.specialtyId ?? spec.id;
              const label = spec.specialtyName ?? spec.name;
              return (
                <option key={id} value={id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {/* Doctor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Doctor
          </label>
          <select
            value={filters.doctorId}
            onChange={(e) => onInputChange('doctorId', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          >
            <option value="">Todos los Doctores</option>
            {doctors.map((doc) => {
              const id = doc.doctorId ?? doc.id;
              return (
                <option key={id} value={id}>
                  {doc.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Fecha */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-med-text-sub">
            Fecha
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-1 focus:ring-med-primary-600"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2 rounded-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>{loading ? 'Buscando...' : 'Aplicar'}</span>
          </Button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-3 py-2 text-xs font-medium text-med-text-sub bg-white border border-med-border rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Chips de Filtros Activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
          {appliedFilters.dni && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
              DNI: {appliedFilters.dni}
              <button
                type="button"
                onClick={() => onRemoveSingleFilter('dni')}
                className="hover:text-sky-950 font-bold"
              >
                ×
              </button>
            </span>
          )}
          {appliedFilters.specialtyId && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
              Especialidad:{' '}
              {selectedSpecialtyName ?? appliedFilters.specialtyId}
              <button
                type="button"
                onClick={() => onRemoveSingleFilter('specialtyId')}
                className="hover:text-sky-950 font-bold"
              >
                ×
              </button>
            </span>
          )}
          {appliedFilters.doctorId && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-100/70 text-sky-800">
              Doctor: {selectedDoctorName ?? appliedFilters.doctorId}
              <button
                type="button"
                onClick={() => onRemoveSingleFilter('doctorId')}
                className="hover:text-sky-950 font-bold"
              >
                ×
              </button>
            </span>
          )}
          {appliedFilters.date && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Fecha: {appliedFilters.date}
              <button
                type="button"
                onClick={() => onRemoveSingleFilter('date')}
                className="hover:text-emerald-950 font-bold"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

export default AppointmentsFilterForm;
