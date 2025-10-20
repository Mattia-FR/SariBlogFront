import { api } from "../../lib/api.ts";
import { type PaginationParams, parseQueryParams } from "./parseQueryParams.ts";
import { withErrorHandling } from "./withErrorHandling.ts";

/**
 * Interface pour les données paginées
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
}

/**
 * Configuration pour créer un loader paginé
 */
export interface PaginatedLoaderConfig {
  endpoint: string;
  defaultLimit?: number;
  defaultOffset?: number;
  dataKey?: string; // Clé pour extraire les données de la réponse (défaut: "data")
}

/**
 * Factory pour créer des loaders avec pagination
 * @param config - Configuration du loader
 * @returns Fonction loader avec pagination
 */
export const createPaginatedLoader = <T>({
  endpoint,
  defaultLimit = 12,
  defaultOffset = 0,
  dataKey = "data",
}: PaginatedLoaderConfig) => {
  return withErrorHandling(
    async ({ request }: { request: Request }): Promise<PaginatedData<T>> => {
      const { limit, offset } = parseQueryParams(
        request,
        defaultLimit,
        defaultOffset,
      );

      const { data } = await api.get(
        `${endpoint}?limit=${limit}&offset=${offset}`,
      );

      return {
        items: data?.[dataKey]?.items || [],
        pagination: data?.[dataKey]?.pagination || {
          limit,
          offset,
          totalCount: 0,
          totalPages: 0,
        },
      };
    },
    {
      items: [],
      pagination: {
        limit: defaultLimit,
        offset: defaultOffset,
        totalCount: 0,
        totalPages: 0,
      },
    },
  );
};
