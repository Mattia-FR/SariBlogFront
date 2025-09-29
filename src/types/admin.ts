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

// Types pour les messages admin
export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type MessageStats = {
  total: number;
  unread: number;
  read: number;
};

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

// Types pour les utilisateurs admin
export type AdminUser = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateUserData = {
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor";
};

export type UpdateUserData = {
  username?: string;
  email?: string;
  role?: "admin" | "editor";
  is_active?: boolean;
};

export type ChangePasswordData = {
  newPassword: string;
};

export type UserStats = {
  total: number;
  active: number;
  inactive: number;
  by_role: {
    admin: number;
    editor: number;
  };
};

// Types pour le contenu "À propos" admin
export type AdminAbout = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
};

export type UpdateAboutData = {
  content?: string;
  image?: string;
};

export type AboutHistory = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
  updated_by: string;
};

// Types pour l'upload
export type UploadedFile = {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedAt: string;
};

export type UploadResponse = {
  file: UploadedFile;
  message: string;
};

export type MultipleUploadResponse = {
  files: UploadedFile[];
  count: number;
  message: string;
};

// Types pour la pagination admin
export type AdminPagination = {
  limit: number;
  offset: number;
  totalCount: number;
  totalPages: number;
};

// Types pour les réponses API admin
export type AdminApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type AdminListResponse<T> = {
  items: T[];
  pagination: AdminPagination;
};

// Types pour les erreurs admin
export type AdminError = {
  code: string;
  message: string;
};

export type AdminErrorResponse = {
  success: false;
  error: AdminError;
};
