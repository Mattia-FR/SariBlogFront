import type { Image } from "../../../types/image";
import { api } from "../../../utils/api";
import type { GalleryLoaderData } from "./galleryTypes";

export async function galleryLoader(): Promise<GalleryLoaderData> {
  const images = await api.get<Image[]>("/images/gallery");

  return { images };
}
