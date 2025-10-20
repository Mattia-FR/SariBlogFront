import type { Article } from "./article";

export type ArticlesPageData = {
  articles: Article[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
};
