import type { Category } from "../../../types/categories";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { GalleryHubLoaderData } from "./galleryHubTypes";

export async function galleryHubLoader(): Promise<GalleryHubLoaderData> {
  const categories = await loaderFetch<Category[]>("/categories");
  return { categories };
}
