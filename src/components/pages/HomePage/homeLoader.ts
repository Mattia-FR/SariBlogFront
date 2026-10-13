import type { Article } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { loaderFetch, loaderFetchOptional } from "../../../utils/loaderFetch";
import type { HomeLoaderData } from "./homeTypes";

export async function homeLoader(): Promise<HomeLoaderData> {
  // L'image du jour est secondaire (404 si la galerie est vide) : null plutôt qu'une page d'erreur.
  const [articles, imageOfTheDay, user] = await Promise.all([
    loaderFetch<Article[]>("/articles/homepage-preview"),
    loaderFetchOptional<Image | null>("/images/image-of-the-day", null),
    loaderFetch<User>("/users/artist"),
  ]);

  return { articles, imageOfTheDay, user };
}
