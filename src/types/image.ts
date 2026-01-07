/**
 * Image côté frontend
 * 🔒 `path` SUPPRIMÉ
 * 🔒 dates = string
 */
export interface Image {
  id: number;
  title: string | null;
  description: string | null;
  alt_descr: string | null;
  is_in_gallery: boolean;
  user_id: number;
  article_id: number | null;
  created_at: string;
  updated_at: string;
  imageUrl: string;
}

/**
 * Image affichée dans un article
 */
export interface ImageForArticle {
  id: number;
  title: string | null;
  alt_descr: string | null;
  article_id: number | null;
  imageUrl: string;
}

export interface ImageCardProps {
  image: Image;
}
