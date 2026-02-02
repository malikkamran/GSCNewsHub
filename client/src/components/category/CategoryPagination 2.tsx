interface CategoryPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function CategoryPagination({ currentPage, totalItems, pageSize, onPageChange }: CategoryPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goTo = (page: number) => {
    const p = Math.min(totalPages, Math.max(1, page));
    onPageChange(p);
  };

  const pages = (() => {
    const arr: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  })();

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <div className="flex items-center gap-2" role="group" aria-label="Page navigation controls">
        <button
          type="button"
          className="px-3 py-2 border rounded disabled:opacity-50"
          aria-label="Previous page"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        {pages[0] > 1 && (
          <>
            <button type="button" className="px-3 py-2 border rounded" onClick={() => goTo(1)} aria-label="Page 1">1</button>
            <span className="px-2" aria-hidden="true">…</span>
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`px-3 py-2 border rounded ${p === currentPage ? 'bg-[#BB1919] text-white border-[#BB1919]' : ''}`}
            aria-current={p === currentPage ? 'page' : undefined}
            aria-label={`Page ${p}`}
            onClick={() => goTo(p)}
          >
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            <span className="px-2" aria-hidden="true">…</span>
            <button type="button" className="px-3 py-2 border rounded" onClick={() => goTo(totalPages)} aria-label={`Page ${totalPages}`}>{totalPages}</button>
          </>
        )}
        <button
          type="button"
          className="px-3 py-2 border rounded disabled:opacity-50"
          aria-label="Next page"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
      <div className="flex items-center gap-2" aria-label="Jump to page">
        <label htmlFor="jump-page" className="sr-only">Jump to page</label>
        <input
          id="jump-page"
          type="number"
          min={1}
          max={totalPages}
          defaultValue={currentPage}
          className="w-16 px-2 py-2 border rounded"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const v = parseInt((e.target as HTMLInputElement).value);
              if (!isNaN(v)) goTo(v);
            }
          }}
          aria-label="Jump to page number"
        />
        <span className="text-sm text-[#5A5A5A]">{totalItems} results</span>
      </div>
    </nav>
  );
}
