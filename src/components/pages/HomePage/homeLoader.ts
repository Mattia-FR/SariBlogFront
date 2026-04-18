import type { Article } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { HomeLoaderData } from "./homeTypes";

export async function homeLoader(): Promise<HomeLoaderData> {
  const [articles, imageOfTheDay, user] = await Promise.all([
    loaderFetch<Article[]>("/articles/homepage-preview"),
    loaderFetch<Image | null>("/images/image-of-the-day"),
    loaderFetch<User>("/users/artist"),
  ]);

  return { articles, imageOfTheDay, user };
}
