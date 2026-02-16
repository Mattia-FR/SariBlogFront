import type { LoaderFunctionArgs } from "react-router-dom";
import type { Article } from "../../../types/article";
import type { Comment } from "../../../types/comment";
import type { Image } from "../../../types/image";
import type { Tag } from "../../../types/tags";
import { api } from "../../../utils/apiClient";
import type { ArticleLoaderData } from "./articleTypes";

export async function articleLoader({
  params,
}: LoaderFunctionArgs): Promise<ArticleLoaderData> {
  // On charge d'abord l'article par slug (fourni par l'URL).
  // Les routes images, tags et commentaires nécessitent l'id de l'article.
  const article = await api.get<Article>(
    `/articles/published/slug/${params.slug}`,
  );

  // Une fois article.id disponible, on récupère en parallèle les données liées à l'article.
  const [articleImages, tags, comments] = await Promise.all([
    api.get<Image[]>(`/images/article/${article.id}`),
    api.get<Tag[]>(`/tags/article/${article.id}`),
    api.get<Comment[]>(`/comments/article/${article.id}`),
  ]);

  return {
    article: { ...article, tags },
    articleImages,
    comments,
  };
}
