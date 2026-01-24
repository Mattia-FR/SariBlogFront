// Types pour les messages côté frontend
// Basés sur les types backend

export interface Message {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string | null;
  ip: string | null;
  subject: string;
  text: string;
  status: "unread" | "read" | "archived";
  user_id: number | null;
  created_at: Date;
}

export interface MessageCreateData {
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  username?: string | null;
  subject: string;
  text: string;
}
