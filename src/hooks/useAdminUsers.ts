import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminListResponse,
  AdminUser,
  ChangePasswordData,
  CreateUserData,
  UpdateUserData,
  UserStats,
} from "../types/admin";

// Hook pour lister les utilisateurs admin
export const useAdminUsers = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminUser> & { stats: UserStats }
  >(`/admin/users?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: false,
  });

  const createUser = async (userData: CreateUserData) => {
    const response = await api.post("/admin/users", userData);
    mutate();
    return response.data;
  };

  const updateUser = async (id: number, userData: UpdateUserData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    mutate();
    return response.data;
  };

  const deleteUser = async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    mutate();
    return response.data;
  };

  const changePassword = async (
    id: number,
    passwordData: ChangePasswordData,
  ) => {
    const response = await api.put(`/admin/users/${id}/password`, passwordData);
    mutate();
    return response.data;
  };

  const toggleActive = async (id: number) => {
    const response = await api.put(`/admin/users/${id}/toggle-active`);
    mutate();
    return response.data;
  };

  return {
    users: data?.items || [],
    pagination: data?.pagination,
    stats: data?.stats,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    toggleActive,
    mutate,
  };
};

// Hook pour un utilisateur spécifique
export const useAdminUser = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ user: AdminUser }>(
    id ? `/admin/users/${id}` : null,
    null,
    { revalidateOnMount: false },
  );

  return {
    user: data?.user,
    isLoading,
    error,
    mutate,
  };
};
