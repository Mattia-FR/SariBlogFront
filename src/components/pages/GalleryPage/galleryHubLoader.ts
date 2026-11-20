import type { LoaderFunctionArgs } from "react-router-dom";
import type { Category } from "../../../types/categories";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { GalleryHubLoaderData } from "./galleryHubTypes";

export async function galleryHubLoader({
  request,
}: LoaderFunctionArgs): Promise<GalleryHubLoaderData> {
  const categories = await loaderFetch<Category[]>(
    "/categories",
    request.signal,
  );
  return { categories };
}
