import type { Article } from "../../../../types/article";

export type ArticlesAdminList = Article & { comments_count?: number };

export interface ArticlesAdminLoaderData {
  articles: ArticlesAdminList[];
}
