import type { Image } from "../../../types/image";
import { api } from "../../../utils/api";

export async function galleryLoader() {
  const images = await api.get<Image[]>("/images/gallery");

  return { images };
}
