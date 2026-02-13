import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { GalleryLoaderData } from "./galleryTypes";

export async function galleryLoader(): Promise<GalleryLoaderData> {
  // Récupérer images ET tags en parallèle
  const [images, tags] = await Promise.all([
    api.get<Image[]>("/images/gallery"),
    api.get<Tag[]>("/tags"),
  ]);

  return { images, tags };
}
