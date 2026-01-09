import type { ArticleListItem } from "../../../types/article";
import { api } from "../../../utils/api";
import type { BlogLoaderData } from "./blogTypes";

export async function blogLoader(): Promise<BlogLoaderData> {
  const articles = await api.get<ArticleListItem[]>("/articles/published");

  return { articles };
}
