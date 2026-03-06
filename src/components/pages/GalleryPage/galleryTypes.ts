import type { Category } from "../../../types/categories";
import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";

export interface GalleryLoaderData {
  images: Image[];
  tags: Tag[];
  /** Présent quand on affiche la galerie d'une catégorie (route /gallery/:slug). */
  category?: Category;
}
