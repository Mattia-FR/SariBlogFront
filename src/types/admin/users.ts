// Import des types dépendants
import type { AdminPagination } from './common';

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

// Types pour les réponses API spécifiques aux utilisateurs
export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: AdminPagination;
};

export type AdminUsersPageData = {
  users: AdminUser[];
  pagination: AdminPagination;
  stats: UserStats;
};
