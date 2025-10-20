import type { Article } from "./article";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type PaginationData = {
  limit: number;
  offset: number;
  totalCount: number;
  totalPages: number;
};

export type ArticlesPageData = {
  articles: Article[];
  pagination: PaginationData;
};
