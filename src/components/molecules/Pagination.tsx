import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PaginationProps } from "../../types/pagination";

import "./Pagination.css";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // Logique simple pour afficher les pages
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <section className="pagination" aria-label="Navigation des pages">
      <button
        type="button"
        onClick={handleFirst}
        disabled={currentPage === 1}
        className="pagination-btn first-btn"
        aria-label="Première page"
      >
        <ChevronsLeft />
      </button>

      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-btn prev-btn"
        aria-label="Page précédente"
      >
        <ChevronLeft />
      </button>

      {visiblePages.map((page, index) => {
        const key =
          typeof page === "number"
            ? `page-${page}`
            : `ellipsis-${index}-${currentPage}`;

        return (
          <button
            key={key}
            type="button"
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={typeof page !== "number"}
            className={`pagination-btn page-btn ${
              page === currentPage ? "active" : ""
            } ${typeof page !== "number" ? "ellipsis" : ""}`}
            aria-label={
              typeof page === "number" ? `Aller à la page ${page}` : undefined
            }
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-btn next-btn"
        aria-label="Page suivante"
      >
        <ChevronRight />
      </button>

      <button
        type="button"
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className="pagination-btn last-btn"
        aria-label="Dernière page"
      >
        <ChevronsRight />
      </button>
    </section>
  );
}

export default Pagination;
