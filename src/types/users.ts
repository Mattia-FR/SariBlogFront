// Types pour les utilisateurs côté frontend
// Basés sur les types backend

export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: "admin" | "editor" | "subscriber";
  avatar: string | null;
  avatarUrl?: string;
  bio: string | null;
  bio_short: string | null;
  created_at?: Date;
  updated_at?: Date;
}
