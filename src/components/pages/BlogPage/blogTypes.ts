import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";

export interface BlogLoaderData {
  articles: Article[];
  tags: Tag[];
}
