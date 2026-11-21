import TablePagination from '../../shared/components/TablePagination';

function DashboardTable({
  doctors,
  isLoading,
  totalCountDoctors,
  pageIndex,
  pageSize,
  onPageChange,
  onDetail,
  searchTerm,
  onSearchChange
}) {
  return (
    <div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Directorio de Profesionales Médicos
          </h2>
          <div className="relative w-full sm:w-72">
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
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-med-primary-50/70 border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>
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
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-med-text-muted"
                >
                  Cargando doctores...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-med-text-muted"
                >
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
                      </div>
                      <div>
                        <p className="font-semibold text-med-primary-900 leading-tight">
                          {doc.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Especialidad Badge en Píldora */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full">
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
                        onClick={() => onDetail()}
                      >
                        Ver detalle
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={pageIndex}
        totalItems={totalCountDoctors}
        pageSize={pageSize}
        disabled={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default DashboardTable;
