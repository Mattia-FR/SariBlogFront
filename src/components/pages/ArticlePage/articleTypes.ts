import type { Article } from "../../../types/article";
import type { ImageForArticle } from "../../../types/image";

export interface ArticleLoaderData {
  article: Article;
  articleImages: ImageForArticle[];
}
