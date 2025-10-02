// Import des types dépendants
import type { AdminPagination } from "./common";

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

// Types pour les réponses API spécifiques aux messages
export type AdminMessagesResponse = {
  messages: AdminMessage[];
  pagination: AdminPagination;
};

export type AdminMessagesPageData = {
  messages: AdminMessage[];
  pagination: AdminPagination;
  stats: MessageStats;
};
