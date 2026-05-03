export type MessageStatus = "unread" | "read" | "archived";

export interface Message {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  ip: string | null;
  subject: string;
  text: string;
  status: MessageStatus;
  created_at: string;
}

export interface MessageCardProps {
  message: Message;
}

export interface MessageCreateData {
  firstname?: string | null;
  lastname?: string | null;
  email: string;
  subject: string;
  text: string;
}
