import type { Article } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { api } from "../../../utils/apiClient";
import type { HomeLoaderData } from "./homeTypes";

export async function homeLoader(): Promise<HomeLoaderData> {
  const [articles, imageOfTheDay, user] = await Promise.all([
    api.get<Article[]>("/articles/homepage-preview"),
    api.get<Image | null>("/images/image-of-the-day"),
    api.get<User>("/users/artist"),
  ]);

  return { articles, imageOfTheDay, user };
}
