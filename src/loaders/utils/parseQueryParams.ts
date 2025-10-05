/**
 * Utilitaires pour parser les paramètres de requête
 */

export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * Parse les paramètres de pagination depuis l'URL
 * @param request - L'objet Request de React Router
 * @param defaultLimit - Limite par défaut (défaut: 12)
 * @param defaultOffset - Offset par défaut (défaut: 0)
 * @returns Les paramètres de pagination parsés
 */
export const parseQueryParams = (
  request: Request,
  defaultLimit = 12,
  defaultOffset = 0,
): PaginationParams => {
  const url = new URL(request.url);
  const limit = Number.parseInt(
    url.searchParams.get("limit") || defaultLimit.toString(),
    10,
  );
  const offset = Number.parseInt(
    url.searchParams.get("offset") || defaultOffset.toString(),
    10,
  );

  return { limit, offset };
};



