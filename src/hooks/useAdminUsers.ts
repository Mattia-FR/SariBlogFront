import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminListResponse,
  AdminUser,
  ChangePasswordData,
  CreateUserData,
  UpdateUserData,
  UserStats, // ✅ Ajouter l'import
} from "../types/admin";

// Hook pour lister les utilisateurs admin
export const useAdminUsers = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminUser>
  >(`/admin/users?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: true,
  });

  const createUser = async (userData: CreateUserData) => {
    const response = await api.post("/admin/users", userData);
    mutate(); // Revalidation
    return response.data;
  };

  const updateUser = async (id: number, userData: UpdateUserData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    mutate(); // Revalidation
    return response.data;
  };

  const changePassword = async (
    id: number,
    passwordData: ChangePasswordData,
  ) => {
    const response = await api.put(`/admin/users/${id}/password`, passwordData);
    mutate(); // Revalidation
    return response.data;
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    const response = await api.put(`/admin/users/${id}/toggle`, {
      is_active: isActive,
    });
    mutate(); // Revalidation
    return response.data;
  };

  const deleteUser = async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    mutate(); // Revalidation
    return response.data;
  };

  return {
    users: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createUser,
    updateUser,
    changePassword,
    toggleActive,
    deleteUser,
    mutate,
  };
};

// ✅ Ajouter le hook pour les stats
export const useAdminUserStats = () => {
  const { data, error, isLoading } = useSWR<{ stats: UserStats }>(
    "/admin/users/stats",
    null,
    { revalidateOnMount: true },
  );

  return {
    stats: data?.stats,
    isLoading,
    error,
  };
};

// Hook pour un utilisateur spécifique
export const useAdminUser = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ user: AdminUser }>(
    id ? `/admin/users/${id}` : null,
    null,
    { revalidateOnMount: true },
  );

  return {
    user: data?.user,
    isLoading,
    error,
    mutate,
  };
};
