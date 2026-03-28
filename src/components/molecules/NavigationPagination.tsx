import { useNavigate } from "react-router-dom";
import type { NavigationPaginationProps } from "../../types/pagination";
import Pagination from "../atoms/Pagination";
import "./NavigationPagination.css";

function NavigationPagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: NavigationPaginationProps) {
  const navigate = useNavigate();

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(newPage) => {
        const p = searchParams
          ? new URLSearchParams(searchParams)
          : new URLSearchParams();
        p.set("page", String(newPage));
        const q = p.toString();
        navigate(q ? `${basePath}?${q}` : basePath);
      }}
    />
  );
}

export default NavigationPagination;
