import type { ArticleForList } from "../../../types/article";
import type { Image } from "../../../types/image";
import type { User } from "../../../types/users";

export interface HomeLoaderData {
  articles: ArticleForList[];
  imageOfTheDay: Image | null;
  user: User;
}
