import type { Tag } from "./tags";

export type ArticleStatus = "draft" | "published" | "archived";

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  status: ArticleStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  featured_image_id: number | null;
  imageUrl?: string;
  tags?: Tag[];
}

export interface ArticleCardProps {
  article: Article;
  isClickable?: boolean;
  isAdmin?: boolean;
}

export interface ArticlePageProps {
  article: Article;
}

export interface ArticlesPreviewProps {
  articles: Article[];
}
