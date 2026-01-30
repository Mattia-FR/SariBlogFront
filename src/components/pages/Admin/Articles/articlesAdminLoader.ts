import type { ArticlesAdminList } from "./articlesAdminTypes";
import { api } from "../../../../utils/apiClient";
import type { ArticlesAdminLoaderData } from "./articlesAdminTypes";

export async function articlesAdminLoader(): Promise<ArticlesAdminLoaderData> {
  const articles = await api.get<ArticlesAdminList[]>("/admin/articles");
  return { articles };
}