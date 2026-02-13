export type UserRole = "admin" | "editor" | "subscriber";

export interface User {
  id: number;
  username: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  role: UserRole;
  avatar: string | null;
  avatarUrl?: string;
  bio: string | null;
  bio_short: string | null;
  created_at: string;
  updated_at: string;
}
