import { api } from "../../../utils/apiClient";
import type { Category } from "../../../types/categories";
import type { GalleryHubLoaderData } from "./galleryHubTypes";

export async function galleryHubLoader(): Promise<GalleryHubLoaderData> {
  const categories = await api.get<Category[]>("/categories");
  return { categories };
}
