import type { Tag } from "./tags";

export interface Image {
  id: number;
  title: string | null;
  description: string | null;
  alt_descr: string | null;
  is_in_gallery: boolean;
  user_id: number;
  article_id: number | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  tags?: Tag[];
}

export interface ImageCardProps {
  image: Image;
  /** Si défini, la carte est un lien (ex. édition admin) au lieu de la fiche galerie. */
  linkTo?: string;
  onClick?: (image: Image) => void;
}
