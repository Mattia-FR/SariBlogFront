/**
 * Wrapper pour la gestion d'erreurs dans les loaders
 */

/**
 * Wrapper qui gère les erreurs de manière standardisée
 * @param loader - La fonction loader à wrapper
 * @param fallbackData - Les données de fallback en cas d'erreur
 * @returns Le loader wrappé avec gestion d'erreurs
 */
export const withErrorHandling = <T>(
  loader: () => Promise<T>,
  fallbackData: T,
) => {
  return async (): Promise<T> => {
    try {
      return await loader();
    } catch (error) {
      console.error("❌ Erreur dans le loader:", error);
      return fallbackData;
    }
  };
};

/**
 * Wrapper pour les loaders qui peuvent lever des erreurs (comme les détails)
 * @param loader - La fonction loader à wrapper
 * @returns Le loader wrappé avec gestion d'erreurs
 */
export const withErrorHandlingAndThrow = <T>(loader: () => Promise<T>) => {
  return async (): Promise<T> => {
    try {
      return await loader();
    } catch (error) {
      console.error("❌ Erreur dans le loader:", error);
      throw error; // Re-lance l'erreur pour React Router
    }
  };
};



