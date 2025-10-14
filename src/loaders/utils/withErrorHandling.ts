/**
 * Wrapper pour la gestion d'erreurs dans les loaders
 */

/**
 * Wrapper qui gère les erreurs de manière standardisée
 * @param loader - La fonction loader à wrapper
 * @param fallbackData - Les données de fallback en cas d'erreur
 * @returns Le loader wrappé avec gestion d'erreurs
 */
export const withErrorHandling = <T, P extends any[]>(
  loader: (...args: P) => Promise<T>,
  fallbackData: T,
) => {
  return async (...args: P): Promise<T> => {
    try {
      return await loader(...args);
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
export const withErrorHandlingAndThrow = <T, P extends any[]>(
  loader: (...args: P) => Promise<T>,
) => {
  return async (...args: P): Promise<T> => {
    try {
      return await loader(...args);
    } catch (error) {
      console.error("❌ Erreur dans le loader:", error);
      throw error; // Re-lance l'erreur pour React Router
    }
  };
};
