import type { Article } from "../../../types/article";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { BlogLoaderData } from "./blogTypes";

export async function blogLoader({
  request,
}: {
  request: Request;
}): Promise<BlogLoaderData> {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;

  const [{ articles, total, limit }, tags] = await Promise.all([
    api.get<{ articles: Article[]; total: number; limit: number }>(
      `/articles/published?page=${page}`,
    ),
    api.get<Tag[]>("/tags"),
  ]);

  // flatMap = .map(...).flat() et permet d'obtenir un seul tableau
  // Set est une structure qui dédoublonne automatiquement.
  const usedTagIds = new Set(
    articles.flatMap((article) => article.tags?.map((t) => t.id) ?? []),
  );
  const filteredTags = tags.filter((tag) => usedTagIds.has(tag.id));
  const totalPages = Math.ceil(total / limit);

  return { articles, tags: filteredTags, page, totalPages };
}
