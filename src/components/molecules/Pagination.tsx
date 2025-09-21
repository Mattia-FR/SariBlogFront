import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "../../types/pagination";

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

  if (totalPages <= 1) return null;

  return (
    <section className="pagination" aria-label="Navigation des pages">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-btn prev-btn"
        aria-label="Page précédente"
      >
        <ChevronLeft />
      </button>

      <span className="pagination-info">
        Page {currentPage} sur {totalPages}
      </span>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-btn next-btn"
        aria-label="Page suivante"
      >
        <ChevronRight />
      </button>
    </section>
  );
}

export default Pagination;
