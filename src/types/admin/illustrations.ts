// Import des types dépendants

import type { AdminPagination } from "./common";
import type { AdminTag } from "./tags";

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

// Types pour les composants admin des illustrations
export type AdminIllustrationFormProps = {
  formData: CreateIllustrationData;
  setFormData: React.Dispatch<React.SetStateAction<CreateIllustrationData>>;
  tags: AdminTag[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

export type AdminIllustrationCardProps = {
  illustration: AdminIllustration;
  onEdit: (illustration: AdminIllustration) => void;
  onDelete: (id: number) => void;
};
