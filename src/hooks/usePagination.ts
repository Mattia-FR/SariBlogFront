import { useSearchParams } from "react-router-dom";
import type { PaginationData } from "../types/pagination";

export function usePagination(defaultLimit = 12) {
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Number.parseInt(
    searchParams.get("limit") || defaultLimit.toString(),
    10,
  );
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10);

  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number, paginationData: PaginationData) => {
    const newOffset = (page - 1) * paginationData.limit;
    setSearchParams({
      offset: newOffset.toString(),
      limit: paginationData.limit.toString(),
    });
  };

  return {
    limit,
    offset,
    currentPage,
    handlePageChange,
  };
}
