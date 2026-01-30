import type { ArticleForList } from "../../../../types/article";

export interface ArticlesAdminList extends ArticleForList {
  status: "draft" | "published" | "archived";
  views: number;
  commentsCount?: number;
  updated_at: string;
}

export interface ArticlesAdminLoaderData {
  articles: ArticlesAdminList[];
}