import Card from '../../shared/components/Card';

function DoctorsTable({
  doctors,
  isLoading,
  totalCount,
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
            Registros de Doctores
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub border-b border-med-border">
              <tr>
                <th className="px-6 py-3.5">Nombre del Doctor</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5 text-center">
                  Estado de Disponibilidad
                </th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-med-border-subtle">
              {isLoading ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted">
                  Cargando doctores...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-med-text-muted">
                  No se encontraron doctores.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr
                  key={doc.licenseNumber}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* Doctor Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-med-primary-100 flex items-center justify-center text-xl">
                          {doc.avatar ?? '👨‍⚕️'}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            doc.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-med-primary-900 leading-tight">
                          {doc.name}
                        </p>
                        <p className="text-xs text-med-text-muted mt-0.5">
                         Matrícula: {doc.licenseNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Especialidad Badge en Píldora */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                      {doc.specialty.name}
                    </span>
                  </td>

                  {/* Estado de Disponibilidad */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        doc.isActive
                          ? 'bg-med-active-bg text-med-active-text'
                          : 'bg-med-danger-bg text-med-danger-text'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          doc.isActive
                            ? 'bg-med-active-text'
                            : 'bg-med-danger-text'
                        }`}
                      />
                      {doc.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Botones de Acciones (Ojo, Lápiz, Basurero) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-med-primary-600">
                      <button
                        title="Ver detalle"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Ver detalle de ${doc.name}`)}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      <button
                        title="Editar profesional"
                        className="p-1.5 rounded-lg hover:bg-med-primary-50 text-med-primary-600 hover:text-med-primary-900 transition"
                        onClick={() => alert(`Editar profesional ${doc.name}`)}
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
                        title="Eliminar doctor"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-med-danger-text transition"
                        onClick={() => onDelete(doc)}
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

        {/* Paginador normalizado idéntico a Búsqueda y Filtrado de Citas */}
        <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
          <span className="text-sm">
          Mostrando {doctors.length} de {totalCount} registros
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
            disabled={pageIndex * pageSize >= totalCount}
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

export default DoctorsTable;