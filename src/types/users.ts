// Types pour les utilisateurs côté frontend
// Basés sur les types backend

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstname: string | null;
  lastname: string | null;
  role: "admin" | "editor" | "subscriber";
  avatar: string | null;
  bio: string | null;
  bio_short: string | null;
}
