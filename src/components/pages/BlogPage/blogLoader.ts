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
  const tagIdRaw = url.searchParams.get("tagId");
  let tagId: number | null = null;
  if (tagIdRaw != null && tagIdRaw !== "") {
    const n = Number(tagIdRaw);
    if (!Number.isInteger(n) || n < 1) {
      throw new Response("Paramètre tagId invalide", { status: 400 });
    }
    tagId = n;
  }

  const publishedQuery = new URLSearchParams({ page: String(page) });
  if (tagId != null) {
    publishedQuery.set("tagId", String(tagId));
  }

  const [{ articles, total, limit }, tags] = await Promise.all([
    api.get<{ articles: Article[]; total: number; limit: number }>(
      `/articles/published?${publishedQuery.toString()}`,
    ),
    api.get<Tag[]>("/tags/published-articles"),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { articles, tags, page, totalPages, tagId };
}
