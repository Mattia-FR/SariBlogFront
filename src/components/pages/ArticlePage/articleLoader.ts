import type { LoaderFunctionArgs } from "react-router-dom";
import type { Article } from "../../../types/article";
import type { ImageForArticle } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { ArticleLoaderData } from "./articleTypes";

export async function articleLoader({
  params,
}: LoaderFunctionArgs): Promise<ArticleLoaderData> {
  const article = await api.get<Article>(
    `/articles/published/slug/${params.slug}`,
  );

  const [articleImages, tags] = await Promise.all([
    api.get<ImageForArticle[]>(`/images/article/${article.id}`),
    api.get<Tag[]>(`/tags/article/${article.id}`),
  ]);

  return {
    article: { ...article, tags },
    articleImages,
  };
}
