import type { ArticleForList } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";
import { api } from "../../../utils/api";

export async function homeLoader() {
  const articles = await api.get<ArticleForList[]>(
    "/articles/homepage-preview",
  );

  const imageOfTheDay = await api.get<Image | null>("/images/image-of-the-day");

  const user = await api.get<User>("/users/artist");

  return { articles, imageOfTheDay, user };
}
