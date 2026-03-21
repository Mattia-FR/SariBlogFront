export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface NavigationPaginationProps {
  page: number;
  totalPages: number;
  basePath: string; // ex: "/blog", "/gallery"
  /** Si fourni, fusionné avec `page` à chaque navigation (ex. tagId sur le blog). */
  searchParams?: URLSearchParams;
}
