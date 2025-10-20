import { api } from "../lib/api.ts";
import { withErrorHandling } from "./utils/withErrorHandling.ts";

/**
 * Interface pour les données de la page about
 */
export interface AboutPageData {
  about: unknown | null;
}

/**
 * Loader pour la page about
 */
export const aboutPageLoader = withErrorHandling(
  async (): Promise<AboutPageData> => {
    const { data } = await api.get("/about");
    return {
      about: data?.data?.about || null,
    };
  },
  {
    about: null,
  },
);
