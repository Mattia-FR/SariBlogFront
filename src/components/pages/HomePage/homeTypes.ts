import type { Article } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";

export interface HomeLoaderData {
  articles: Article[];
  imageOfTheDay: Image | null;
  user: User;
}
