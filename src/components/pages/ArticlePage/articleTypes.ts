import type { ArticlePageProps } from "../../../types/article";
import type { ImageForArticle } from "../../../types/image";

export interface ArticleLoaderData {
  article: ArticlePageProps["article"];
  articleImages: ImageForArticle[];
}
