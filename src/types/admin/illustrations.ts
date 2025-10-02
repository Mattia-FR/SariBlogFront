// Import des types dépendants
import type { AdminTag } from './tags';
import type { AdminPagination } from './common';

// Types pour les illustrations admin
export type AdminIllustration = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  alt_text: string;
  is_in_gallery: boolean;
  created_at: string;
  updated_at: string;
  tags: AdminTag[];
};

export type CreateIllustrationData = {
  title: string;
  description?: string;
  image: string;
  alt_text: string;
  is_in_gallery: boolean;
  tagIds: number[];
};

export type UpdateIllustrationData = Partial<CreateIllustrationData>;

// Types pour les réponses API spécifiques aux illustrations
export type AdminIllustrationsResponse = {
  illustrations: AdminIllustration[];
  pagination: AdminPagination;
};

export type AdminIllustrationsPageData = {
  illustrations: AdminIllustration[];
  pagination: AdminPagination;
  tags: AdminTag[];
};
