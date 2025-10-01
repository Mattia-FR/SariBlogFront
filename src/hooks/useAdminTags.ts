import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminListResponse,
  AdminTag,
  CreateTagData,
  TagStats, // ✅ Import du type existant
  UpdateTagData,
} from "../types/admin";

// Hook pour lister les tags admin
export const useAdminTags = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminTag>
  >(`/admin/tags?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: true,
  });

  const createTag = async (tagData: CreateTagData) => {
    const response = await api.post("/admin/tags", tagData);
    mutate(); // Revalidation
    return response.data;
  };

  const updateTag = async (id: number, tagData: UpdateTagData) => {
    const response = await api.put(`/admin/tags/${id}`, tagData);
    mutate(); // Revalidation
    return response.data;
  };

  const deleteTag = async (id: number) => {
    const response = await api.delete(`/admin/tags/${id}`);
    mutate(); // Revalidation
    return response.data;
  };

  return {
    tags: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
    mutate,
  };
};

// Hook pour un tag spécifique
export const useAdminTag = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ tag: AdminTag }>(
    id ? `/admin/tags/${id}` : null,
    null,
    { revalidateOnMount: true },
  );

  return {
    tag: data?.tag,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour les statistiques des tags
export const useAdminTagStats = () => {
  const { data, error, isLoading } = useSWR<{ stats: TagStats }>(
    // ✅ Correction : TagStats au lieu de any
    "/admin/tags/stats",
    null,
    { revalidateOnMount: true },
  );

  return {
    stats: data?.stats,
    isLoading,
    error,
  };
};
