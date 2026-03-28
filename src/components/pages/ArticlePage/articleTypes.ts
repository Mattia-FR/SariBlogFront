import type { ArticlePageProps } from "../../../types/article";
import type { Comment } from "../../../types/comment";
import type { Image } from "../../../types/image";

export interface ArticleLoaderData {
  article: ArticlePageProps["article"];
  articleImages: Image[];
  comments: Comment[];
}
