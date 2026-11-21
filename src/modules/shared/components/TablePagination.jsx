function TablePagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  disabled = false,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
      <span>
        Mostrando {from} a {to} de {totalItems} registros (Página {currentPage}{' '}
        de {totalPages})
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Página anterior"
          onClick={() =>
            onPageChange && onPageChange(Math.max(1, currentPage - 1))
          }
          disabled={disabled || currentPage <= 1}
          className="w-8 h-8 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-lg leading-none hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ‹
        </button>
        <span className="px-2 font-medium text-med-text-main">
          {currentPage}
        </span>
        <button
          type="button"
          aria-label="Página siguiente"
          onClick={() =>
            onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={disabled || currentPage >= totalPages}
          className="w-8 h-8 inline-flex items-center justify-center border border-med-border rounded-md bg-white text-med-text-sub text-lg leading-none hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
