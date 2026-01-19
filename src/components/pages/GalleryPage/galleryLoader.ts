import type { ImageForList } from "../../../types/image";
import { api } from "../../../utils/apiClient";
import type { GalleryLoaderData } from "./galleryTypes";

export async function galleryLoader(): Promise<GalleryLoaderData> {
  const images = await api.get<ImageForList[]>("/images/gallery");

  return { images };
}
