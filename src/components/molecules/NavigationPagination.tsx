import { useNavigate } from "react-router-dom";
import type { NavigationPaginationProps } from "../../types/pagination";
import Pagination from "../atoms/Pagination";
import "./NavigationPagination.css";

function NavigationPagination({
  page,
  totalPages,
  basePath,
}: NavigationPaginationProps) {
  const navigate = useNavigate();

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={(newPage) => navigate(`${basePath}?page=${newPage}`)}
    />
  );
}

export default NavigationPagination;
