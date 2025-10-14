import { api } from "../lib/api.ts";

/**
 * Configuration SWR optimisée pour l'approche hybride
 * Utilise axios au lieu de fetch pour la cohérence avec le reste de l'application
 */
export const swrConfig = {
  fetcher: (url: string) => api.get(url).then((res) => res.data),
  revalidateOnFocus: true, // Revalider quand l'utilisateur revient sur l'onglet
  revalidateOnReconnect: true, // Revalider si la connexion revient
  revalidateOnMount: false, // Ne pas revalider immédiatement (données du loader)
  dedupingInterval: 60000, // 1 minute de déduplication
  errorRetryCount: 3, // Retry automatique en cas d'erreur
  errorRetryInterval: 5000, // 5 secondes entre les retry
  onError: (error: Error) => {
    console.error("SWR Error:", error);
    // Ici vous pourriez ajouter un système de notifications
  },
  onSuccess: (data: Record<string, unknown>, key: string) => {
    console.log(`✅ SWR Success for ${key}:`, data);
  },
};
