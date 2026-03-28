import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";

export type BlogLoaderData = {
  articles: Article[];
  tags: Tag[];
  page: number;
  totalPages: number;
  /** null = tous les tags (pas de filtre dans l’URL). */
  tagId: number | null;
};
