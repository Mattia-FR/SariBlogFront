import useSWR from "swr";
import { api } from "../lib/api";
import type { AboutHistory, AdminAbout, UpdateAboutData } from "../types/admin";

// Hook pour le contenu "À propos"
export const useAdminAbout = () => {
  const { data, error, mutate, isLoading } = useSWR<{ about: AdminAbout }>(
    "/admin/about",
    null,
    { revalidateOnMount: false },
  );

  const updateAbout = async (aboutData: UpdateAboutData) => {
    const response = await api.put("/admin/about", aboutData);
    mutate();
    return response.data;
  };

  const updateContent = async (content: string) => {
    const response = await api.put("/admin/about/content", { content });
    mutate();
    return response.data;
  };

  const updateImage = async (image: string) => {
    const response = await api.put("/admin/about/image", { image });
    mutate();
    return response.data;
  };

  return {
    about: data?.about,
    isLoading,
    error,
    updateAbout,
    updateContent,
    updateImage,
    mutate,
  };
};

// Hook pour l'historique "À propos"
export const useAdminAboutHistory = () => {
  const { data, error, isLoading } = useSWR<{ history: AboutHistory[] }>(
    "/admin/about/history",
    null,
    { revalidateOnMount: false },
  );

  return {
    history: data?.history || [],
    isLoading,
    error,
  };
};
