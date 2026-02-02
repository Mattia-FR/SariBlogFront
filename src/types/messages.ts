export type MessageStatus = "unread" | "read" | "archived";

export interface Message {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  username: string | null;
  ip: string | null;
  subject: string;
  text: string;
  status: MessageStatus;
  user_id: number | null;
  created_at: string;
}

export interface MessageCardProps {
  message: Message;
}

export interface MessageCreateData {
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  username?: string | null;
  subject: string;
  text: string;
}
