import Card from '../../shared/components/Card';

function SpecialtiesTable({
  specialties,
  isLoading,
  totalCountSpecialties,
  pageIndex,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="p-0 overflow-hidden border-med-border">
      <div className="p-5 border-b border-med-border">
        <h2 className="text-base font-bold text-med-primary-900">
          Registros de Especialidades
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
            <tr>
              <th className="px-6 py-3.5">Nombre de la Especialidad</th>
              <th className="px-6 py-3.5">Descripción</th>
              <th className="px-6 py-3.5 text-center">Estado</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border-subtle">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted">
                  Cargando especialidades...
                </td>
              </tr>
            ) : specialties.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted">
                  No se encontraron especialidades.
                </td>
              </tr>
            ) : (
              specialties.map((spec) => (
                <tr
                  key={spec.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-med-primary-100 text-med-primary-700 flex items-center justify-center shrink-0">
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
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                      </div>
                      <span className="font-semibold text-med-primary-900">
                        {spec.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-med-text-sub max-w-md">
                    {spec.description}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {spec.isActive ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-active-bg text-med-active-text">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-med-text-muted">
                      <button
                        title="Editar especialidad"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-text-muted hover:text-med-primary-900 transition"
                        onClick={() => onEdit(spec)}
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>

                      <button
                        title="Eliminar especialidad"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() => onDelete(spec)}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
        <span className="text-sm">
          Mostrando {specialties.length} de {totalCountSpecialties} registros
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={pageIndex <= 1}
            onClick={() => onPageChange(Math.max(pageIndex - 1, 1))}
            className="w-9 h-9 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-3xl leading-none pb-0.5 hover:bg-gray-50 disabled:opacity-50"
          >
            ‹
          </button>
          {pageIndex}
          <button
            disabled={pageIndex * pageSize >= totalCountSpecialties}
            onClick={() => onPageChange(pageIndex + 1)}
            className="w-9 h-9 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-3xl leading-none pb-0.5 hover:bg-gray-50 disabled:opacity-50"
          >
            ›
          </button>
        </div>
      </div>
    </Card>
  );
}

export default SpecialtiesTable;