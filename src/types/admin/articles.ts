// Import des types dépendants

import type { AdminPagination } from "./common";
import type { AdminTag } from "./tags";

// Types pour les articles admin
export type AdminArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  tags: AdminTag[];
};

export type CreateArticleData = {
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  status: "draft" | "published";
  tagIds: number[];
};

export type UpdateArticleData = Partial<CreateArticleData>;

// Types pour les réponses API spécifiques aux articles
export type AdminArticlesResponse = {
  articles: AdminArticle[];
  pagination: AdminPagination;
};

export type AdminArticlesPageData = {
  articles: AdminArticle[];
  pagination: AdminPagination;
  tags: AdminTag[];
};
