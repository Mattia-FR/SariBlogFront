import type { LoaderFunctionArgs } from "react-router-dom";
import type { Article } from "../../../types/article";
import type { Comment } from "../../../types/comment";
import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import { loaderFetch } from "../../../utils/loaderFetch";
import type { ArticleLoaderData } from "./articleTypes";

export async function articleLoader({
  params,
}: LoaderFunctionArgs): Promise<ArticleLoaderData> {
  // On charge d'abord l'article par slug (fourni par l'URL).
  // Les routes images, tags et commentaires nécessitent l'id de l'article.
  const article = await loaderFetch<Article>(
    `/articles/published/slug/${params.slug}`,
  );

  // Une fois article.id disponible, on récupère en parallèle les données liées à l'article.
  const [articleImages, tags, comments] = await Promise.all([
    loaderFetch<Image[]>(`/images/article/${article.id}`),
    loaderFetch<Tag[]>(`/tags/article/${article.id}`),
    loaderFetch<Comment[]>(`/comments/article/${article.id}`),
  ]);

  return {
    article: { ...article, tags },
    articleImages,
    comments,
  };
}
