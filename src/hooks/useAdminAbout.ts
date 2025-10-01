import useSWR from "swr";
import { api } from "../lib/api";
import type { AboutHistory, AdminAbout, UpdateAboutData } from "../types/admin"; // ✅ Import du type AboutHistory

// Hook pour récupérer le contenu "À propos"
export const useAdminAbout = () => {
  const { data, error, mutate, isLoading } = useSWR<{ about: AdminAbout }>(
    "/admin/about",
    null,
    { revalidateOnMount: true },
  );

  const updateAbout = async (aboutData: UpdateAboutData) => {
    const response = await api.put("/admin/about", aboutData);
    mutate(); // Revalidation
    return response.data;
  };

  const updateContent = async (content: string) => {
    const response = await api.put("/admin/about/content", { content });
    mutate(); // Revalidation
    return response.data;
  };

  const updateImage = async (image: string) => {
    const response = await api.put("/admin/about/image", { image });
    mutate(); // Revalidation
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

// Hook pour l'historique des modifications
export const useAdminAboutHistory = () => {
  const { data, error, isLoading } = useSWR<{ history: AboutHistory }>(
    // ✅ Correction : AboutHistory au lieu de any
    "/admin/about/history",
    null,
    { revalidateOnMount: true },
  );

  return {
    history: data?.history,
    isLoading,
    error,
  };
};
