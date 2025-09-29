import useSWR from "swr";
import { api } from "../lib/api";
import type {
  AdminListResponse,
  AdminMessage,
  MessageStats,
} from "../types/admin";

// Hook pour lister les messages admin
export const useAdminMessages = (limit = 12, offset = 0) => {
  const { data, error, mutate, isLoading } = useSWR<
    AdminListResponse<AdminMessage> & { stats: MessageStats }
  >(`/admin/messages?limit=${limit}&offset=${offset}`, null, {
    revalidateOnMount: false,
  });

  const markAsRead = async (id: number) => {
    const response = await api.put(`/admin/messages/${id}/read`);
    mutate();
    return response.data;
  };

  const markAsUnread = async (id: number) => {
    const response = await api.put(`/admin/messages/${id}/unread`);
    mutate();
    return response.data;
  };

  const markAllAsRead = async () => {
    const response = await api.put("/admin/messages/read-all");
    mutate();
    return response.data;
  };

  const deleteMessage = async (id: number) => {
    const response = await api.delete(`/admin/messages/${id}`);
    mutate();
    return response.data;
  };

  const deleteAllRead = async () => {
    const response = await api.delete("/admin/messages/read-all");
    mutate();
    return response.data;
  };

  return {
    messages: data?.items || [],
    pagination: data?.pagination,
    stats: data?.stats,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteMessage,
    deleteAllRead,
    mutate,
  };
};

// Hook pour un message spécifique
export const useAdminMessage = (id: number) => {
  const { data, error, mutate, isLoading } = useSWR<{ message: AdminMessage }>(
    id ? `/admin/messages/${id}` : null,
    null,
    { revalidateOnMount: false },
  );

  return {
    message: data?.message,
    isLoading,
    error,
    mutate,
  };
};
