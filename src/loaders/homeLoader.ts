import { api } from "../lib/api.ts";
import { withErrorHandling } from "./utils/withErrorHandling.ts";

/**
 * Interface pour les données de la page d'accueil
 */
export interface HomePageData {
  articles: unknown[];
  illustrations: unknown[];
  about: unknown | null;
}

/**
 * Loader pour la page d'accueil
 * Charge les derniers articles, les illustrations de prévisualisation et les données about
 */
export const homePageLoader = withErrorHandling(
  async (): Promise<HomePageData> => {
    console.log("🔍 Début du loader...");

    const { data: articlesData } = await api.get("/articles/latest?limit=4");
    console.log("✅ Articles:", articlesData);

    const { data: illustrationsData } = await api.get(
      "/illustrations/gallery-preview",
    );
    console.log("✅ Illustrations:", illustrationsData);

    const { data: aboutData } = await api.get("/about");
    console.log("✅ About:", aboutData);

    return {
      articles: articlesData?.data?.articles || [],
      illustrations: illustrationsData?.data?.illustrations || [],
      about: aboutData?.data?.about || null,
    };
  },
  {
    articles: [],
    illustrations: [],
    about: null,
  },
);



