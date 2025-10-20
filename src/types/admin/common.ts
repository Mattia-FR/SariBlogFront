// Types communs pour l'administration

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

// Type générique pour les réponses avec items (gardé pour compatibilité)
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
