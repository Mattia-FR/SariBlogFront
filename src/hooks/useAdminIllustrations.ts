import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminIllustration,
  AdminListResponse,
  AdminTag, // ✅ Import du type AdminTag
  CreateIllustrationData,
  UpdateIllustrationData,
} from "../types/admin";

// Hook pour lister les illustrations admin
export const useAdminIllustrations = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminIllustration>
  >(`/admin/illustrations?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: true,
  });

  const createIllustration = async (
    illustrationData: CreateIllustrationData,
  ) => {
    const response = await api.post("/admin/illustrations", illustrationData);
    mutate(); // Revalidation
    return response.data;
  };

  const updateIllustration = async (
    id: number,
    illustrationData: UpdateIllustrationData,
  ) => {
    const response = await api.put(
      `/admin/illustrations/${id}`,
      illustrationData,
    );
    mutate(); // Revalidation
    return response.data;
  };

  const deleteIllustration = async (id: number) => {
    const response = await api.delete(`/admin/illustrations/${id}`);
    mutate(); // Revalidation
    return response.data;
  };

  return {
    illustrations: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createIllustration,
    updateIllustration,
    deleteIllustration,
    mutate,
  };
};

// Hook pour une illustration spécifique
export const useAdminIllustration = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{
    illustration: AdminIllustration;
  }>(id ? `/admin/illustrations/${id}` : null, null, {
    revalidateOnMount: true,
  });

  return {
    illustration: data?.illustration,
    isLoading,
    error,
    mutate,
  };
};

// Hook pour les tags des illustrations
export const useAdminIllustrationTags = () => {
  const { data, error, isLoading } = useSWR<{ tags: AdminTag[] }>(
    // ✅ Correction : AdminTag[] au lieu de any[]
    "/admin/illustrations/tags",
    null,
    { revalidateOnMount: true },
  );

  return {
    tags: data?.tags || [],
    isLoading,
    error,
  };
};
