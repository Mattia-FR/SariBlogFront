import type { LoaderFunctionArgs } from "react-router-dom";
import type { Article } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { loaderFetch, loaderFetchOptional } from "../../../utils/loaderFetch";
import type { HomeLoaderData } from "./homeTypes";

export async function homeLoader({
  request,
}: LoaderFunctionArgs): Promise<HomeLoaderData> {
  const { signal } = request;
  // Image du jour et preview galerie sont secondaires : fallback plutôt qu'une page d'erreur.
  const [articles, galleryPreview, imageOfTheDay, user] = await Promise.all([
    loaderFetch<Article[]>("/articles/homepage-preview", signal),
    loaderFetchOptional<Image[]>("/images/homepage-preview", [], signal),
    loaderFetchOptional<Image | null>("/images/image-of-the-day", null, signal),
    loaderFetch<User>("/users/artist", signal),
  ]);

  return { articles, galleryPreview, imageOfTheDay, user };
}
