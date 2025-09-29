import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminListResponse,
  AdminTag,
  CreateTagData,
  TagStats,
  UpdateTagData,
} from "../types/admin";

// Hook pour lister les tags admin
export const useAdminTags = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminTag> & { stats: TagStats }
  >(`/admin/tags?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: false,
  });

  const createTag = async (tagData: CreateTagData) => {
    const response = await api.post("/admin/tags", tagData);
    mutate();
    return response.data;
  };

  const updateTag = async (id: number, tagData: UpdateTagData) => {
    const response = await api.put(`/admin/tags/${id}`, tagData);
    mutate();
    return response.data;
  };

  const deleteTag = async (id: number) => {
    const response = await api.delete(`/admin/tags/${id}`);
    mutate();
    return response.data;
  };

  const searchTags = async (query: string, limit = 10) => {
    const response = await api.get(
      `/admin/tags/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return response.data;
  };

  return {
    tags: data?.items || [],
    pagination: data?.pagination,
    stats: data?.stats,
    isLoading,
    error,
    createTag,
    updateTag,
    deleteTag,
    searchTags,
    mutate,
  };
};

// Hook pour un tag spécifique
export const useAdminTag = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ tag: AdminTag }>(
    id ? `/admin/tags/${id}` : null,
    null,
    { revalidateOnMount: false },
  );

  return {
    tag: data?.tag,
    isLoading,
    error,
    mutate,
  };
};
