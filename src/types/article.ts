import type { Tag } from "./tags";

/**
 * Article pour les listes simples
 * (= /articles/published)
 */
export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published" | "archived";
  user_id: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  featured_image_id: number | null;
}

/**
 * Article complet
 * (= /articles/published/:slug)
 */
export interface Article extends ArticleListItem {
  content: string;
}

/**
 * Article enrichi (homepage, previews)
 * ⚠️ enrichissement NON garanti
 */
export interface ArticleForList extends ArticleListItem {
  imageUrl?: string;
  tags?: Tag[];
}

/**
 * Props composants
 */
export interface ArticleCardProps {
  article: ArticleListItem & Partial<ArticleForList>;
  isClickable?: boolean;
}

export interface ArticlePageProps {
  article: Article & {
    imageUrl?: string;
    tags?: Tag[];
  };
}

export interface ArticlesPreviewProps {
  articles: ArticleForList[];
}
