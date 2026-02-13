import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { BlogLoaderData } from "./blogTypes";

export async function blogLoader(): Promise<BlogLoaderData> {
  const [articles, tags] = await Promise.all([
    api.get<Article[]>("/articles/published"),
    api.get<Tag[]>("/tags"),
  ]);

  return { articles, tags };
}
