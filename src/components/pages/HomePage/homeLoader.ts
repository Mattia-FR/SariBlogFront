import type { ArticleForList } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { api } from "../../../utils/api";

export async function homeLoader() {
  const [articles, imageOfTheDay, user] = await Promise.all([
    api.get<ArticleForList[]>("/articles/homepage-preview"),
    api.get<Image | null>("/images/image-of-the-day"),
    api.get<User>("/users/artist"),
  ]);

  return { articles, imageOfTheDay, user };
}
