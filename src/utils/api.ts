const API_BASE_URL = "http://localhost:4242/api";

/**
 * Client API basé sur fetch natif
 *
 * TODO: Migrer vers Ky
 * La structure est similaire, il suffira de remplacer fetch() par ky()
 */
export const api = {
  /**
   * Effectue une requête GET
   * @param endpoint - Chemin de l'endpoint
   * @returns Les données typées
   * @throws HTTPError si la requête échoue
   */
  get: async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Gestion des erreurs HTTP
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // Parse et retourne les données
    const data = (await response.json()) as T;
    return data;
  },
};
