export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface NavigationPaginationProps {
  page: number;
  totalPages: number;
  basePath: string; // ex: "/blog", "/gallery"
}
