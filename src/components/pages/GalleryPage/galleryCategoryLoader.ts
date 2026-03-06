import type { LoaderFunctionArgs } from "react-router-dom";
import { api } from "../../../utils/apiClient";
import type { Category } from "../../../types/categories";
import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import type { GalleryLoaderData } from "./galleryTypes";

export async function galleryCategoryLoader({
  params,
}: LoaderFunctionArgs): Promise<GalleryLoaderData> {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Slug manquant", { status: 404 });
  }

  const category = await api.get<Category>(`/categories/${slug}`);
  if (!category) {
    throw new Response("Catégorie non trouvée", { status: 404 });
  }

  const [images, tags] = await Promise.all([
    api.get<Image[]>(`/images/category/${category.id}`),
    api.get<Tag[]>("/tags"),
  ]);

  return { images, tags, category };
}
