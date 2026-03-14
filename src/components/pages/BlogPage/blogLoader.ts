import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { BlogLoaderData } from "./blogTypes";

export async function blogLoader(): Promise<BlogLoaderData> {
  const [articles, tags] = await Promise.all([
    api.get<Article[]>("/articles/published"),
    api.get<Tag[]>("/tags"),
  ]);

  // flatMap = .map(...).flat() et permet d'obtenir un seul tableau
  // Set est une structure qui dédoublonne automatiquement.
  const usedTagIds = new Set(
    articles.flatMap((article) => article.tags?.map((t) => t.id) ?? []),
  );
  const filteredTags = tags.filter((tag) => usedTagIds.has(tag.id));

  return { articles, tags: filteredTags };
}
