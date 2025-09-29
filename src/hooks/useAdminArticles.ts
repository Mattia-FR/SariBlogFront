import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminArticle,
  AdminListResponse,
  AdminTag,
  CreateArticleData,
  UpdateArticleData,
} from "../types/admin";

// Hook pour lister les articles admin
export const useAdminArticles = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminArticle>
  >(`/admin/articles?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: false,
  });

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
    articles: data?.items || [],
    pagination: data?.pagination,
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
    { revalidateOnMount: false },
  );

  return {
    article: data?.article,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour les tags des articles
export const useAdminArticleTags = () => {
  const { data, error, isLoading } = useSWR<{ tags: AdminTag[] }>(
    "/admin/articles/tags",
    null,
    { revalidateOnMount: false },
  );

  return {
    tags: data?.tags || [],
    isLoading,
    error,
  };
};
