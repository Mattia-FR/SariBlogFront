import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";

export type BlogLoaderData = {
  articles: Article[];
  tags: Tag[];
  page: number;
  totalPages: number;
};
