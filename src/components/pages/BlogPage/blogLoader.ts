import type { ArticleListItem } from "../../../types/article";
import { api } from "../../../utils/api";

export async function blogLoader() {
  const articles = await api.get<ArticleListItem[]>("/articles/published");

  return { articles };
}
