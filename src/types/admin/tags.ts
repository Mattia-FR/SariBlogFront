// Import des types dépendants
import type { AdminPagination } from "./common";

// Types pour les tags admin
export type AdminTag = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  usage_count?: number;
};

export type CreateTagData = {
  name: string;
};

export type UpdateTagData = {
  name: string;
};

export type TagStats = {
  total: number;
  most_used: AdminTag[];
};

// Types pour les réponses API spécifiques aux tags
export type AdminTagsResponse = {
  tags: AdminTag[];
  pagination: AdminPagination;
};

export type AdminTagsPageData = {
  tags: AdminTag[];
  pagination: AdminPagination;
};
