import type { LoaderFunctionArgs } from "react-router-dom";
import type { Category } from "../../../types/categories";
import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { GalleryLoaderData } from "./galleryTypes";

export async function galleryCategoryLoader({
  params,
  request,
}: LoaderFunctionArgs): Promise<GalleryLoaderData> {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Slug manquant", { status: 404 });
  }
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const tagIdRaw = url.searchParams.get("tagId");
  let tagId: number | null = null;
  if (tagIdRaw != null && tagIdRaw !== "") {
    const n = Number(tagIdRaw);
    if (!Number.isInteger(n) || n < 1) {
      throw new Response("Paramètre tagId invalide", { status: 400 });
    }
    tagId = n;
  }

  const category = await api.get<Category>(`/categories/${slug}`);
  if (!category) {
    throw new Response("Catégorie non trouvée", { status: 404 });
  }

  const imagesQuery = new URLSearchParams({ page: String(page) });
  if (tagId != null) {
    imagesQuery.set("tagId", String(tagId));
  }

  const [{ images, total, limit }, tags] = await Promise.all([
    api.get<{ images: Image[]; total: number; limit: number }>(
      `/images/category/${category.id}?${imagesQuery.toString()}`,
    ),
    api.get<Tag[]>(`/tags/category/${category.id}`),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    images,
    tags,
    category,
    page,
    totalPages,
    total,
    limit,
    tagId,
  };
}
