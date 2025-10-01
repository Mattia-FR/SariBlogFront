import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminArticle,
  AdminArticlesPageData,
  AdminTag,
  CreateArticleData,
  UpdateArticleData,
} from "../types/admin";

// ✅ Hook unifié pour les articles admin (comme useArticles)
export const useAdminArticles = (
  limit = 12,
  offset = 0,
  fallbackData?: AdminArticlesPageData, // ✅ Ajouter fallbackData
) => {
  const { data, error, mutate, isLoading } = useSWR<AdminArticlesPageData>(
    `/admin/articles?limit=${limit}&offset=${offset}`,
    null,
    {
      fallbackData, // ✅ Utiliser fallbackData au lieu de revalidateOnMount: true
    },
  );

  const createArticle = async (articleData: CreateArticleData) => {
    const response = await api.post("/admin/articles", articleData);
    mutate(); // Revalidation
    return response.data;
  };

  const updateArticle = async (id: number, articleData: UpdateArticleData) => {
    const response = await api.put(`/admin/articles/${id}`, articleData);
    mutate(); // Revalidation
    return response.data;
  };

  const deleteArticle = async (id: number) => {
    const response = await api.delete(`/admin/articles/${id}`);
    mutate(); // Revalidation
    return response.data;
  };

  return {
    data, // ✅ Retourner data directement
    isLoading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    mutate,
  };
};

// Hook pour un article spécifique
export const useAdminArticle = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ article: AdminArticle }>(
    id ? `/admin/articles/${id}` : null,
    null,
    { revalidateOnMount: true },
  );

  return {
    article: data?.article,
    isLoading,
    error,
    mutate,
  };
};

// ✅ Hook pour les tags des articles (séparé car pas dans le même endpoint)
export const useAdminArticleTags = (fallbackTags?: AdminTag[]) => {
  const { data, error, isLoading } = useSWR<{ tags: AdminTag[] }>(
    "/admin/articles/tags",
    null,
    {
      fallbackData: fallbackTags ? { tags: fallbackTags } : undefined, // ✅ Utiliser fallbackData
    },
  );

  return {
    tags: data?.tags || [],
    isLoading,
    error,
  };
};
