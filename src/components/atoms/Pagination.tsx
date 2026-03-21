import type { PaginationProps } from "../../types/pagination";

function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  // Moins de 8 pages : on affiche tout
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];
  // Toujours la première page
  pages.push(1);

  // Ellipse gauche si la page courante est loin du début
  if (page > 4) {
    pages.push("...");
  }

  // Pages voisines de la page courante
  // Le Math.max(2, ...) et Math.min(totalPages - 1, ...) sont là pour éviter de dépasser les bornes
  // on ne veut pas afficher 0 ou totalPages + 1, et on ne veut pas non plus dupliquer la première
  // et la dernière page qui sont déjà pushées séparément.
  const start = Math.max(2, page - 2);
  const end = Math.min(totalPages - 1, page + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Ellipse droite si la page courante est loin de la fin
  if (page < totalPages - 3) {
    pages.push("...");
  }

  // Toujours la dernière page
  pages.push(totalPages);

  return pages;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="pagination-btn"
        aria-label="Première page"
      >
        ‹‹
      </button>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="pagination-btn"
        aria-label="Page précédente"
      >
        ‹
      </button>

      {/* Numéros de pages */}
      {pageNumbers.map((p, index) =>
        p === "..." ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: ellipses fixes
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            disabled={p === page}
            className={`pagination-btn ${p === page ? "pagination-btn--active" : ""}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="pagination-btn"
        aria-label="Page suivante"
      >
        ›
      </button>
      <button
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={page === totalPages}
        className="pagination-btn"
        aria-label="Dernière page"
      >
        ››
      </button>
    </nav>
  );
}

export default Pagination;
