export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export interface Comment {
  id: number;
  status?: CommentStatus;
  user_id: number;
  username: string;
  avatar: string | null;
  firstname: string | null;
  lastname: string | null;
  text: string;
  created_at: string;
}

export interface CommentCardProps {
  comment: Comment;
  showStatus?: boolean;
}
