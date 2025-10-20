import type { Article } from "./article";

export type ArticleDetail = Article & {
  content: string;
};

export type ArticleDetailPageData = {
  article: ArticleDetail;
};
