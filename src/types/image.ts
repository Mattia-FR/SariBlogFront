// Types pour les images côté frontend
// Basés sur les types backend

export interface Image {
  id: number;
  title: string | null;
  description: string | null;
  path: string;
  alt_descr: string | null;
  is_in_gallery: boolean;
  user_id: number;
  article_id: number | null;
  created_at: Date;
  updated_at: Date;
}
