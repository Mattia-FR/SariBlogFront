import type { LoaderFunctionArgs } from "react-router-dom";
import type { Article } from "../../../types/article";
import type { ImageForArticle } from "../../../types/image";
import { api } from "../../../utils/api";
import type { ArticleLoaderData } from "./articleTypes";

export async function articleLoader({
  params,
}: LoaderFunctionArgs): Promise<ArticleLoaderData> {
  if (!params.slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const article = await api.get<Article>(`/articles/published/${params.slug}`);

  const articleImages = await api.get<ImageForArticle[]>(
    `/images/article/${article.id}`,
  );

  return { article, articleImages };
}
