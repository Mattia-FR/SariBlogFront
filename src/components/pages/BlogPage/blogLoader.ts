import type { Article } from "../../../types/article";
import { api } from "../../../utils/apiClient";
import type { BlogLoaderData } from "./blogTypes";

export async function blogLoader(): Promise<BlogLoaderData> {
  const articles = await api.get<Article[]>("/articles/published");

  return { articles };
}
