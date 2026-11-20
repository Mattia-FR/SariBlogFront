import { api } from "./apiClient";
import { ApiError, isAbortError } from "./apiError";
import { logger } from "./logger";

// Statut utilisé quand le serveur est injoignable (une Response ne peut pas porter le statut 0).
const NETWORK_ERROR_STATUS = 503;

// Pour les loaders React Router : toute erreur devient une `Response` (statut + message backend),
// lue ensuite par `ErrorPage` via `useRouteError()`. Les AbortError sont relancés tels quels
// pour laisser React Router gérer l'annulation de navigation.
export async function loaderFetch<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> {
  try {
    return await api.get<T>(endpoint, signal ? { signal } : undefined);
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw toRouteErrorResponse(error);
  }
}

export function toRouteErrorResponse(error: unknown): Response {
  if (error instanceof Response) return error;

  if (error instanceof ApiError) {
    const status =
      error.code === "NETWORK_ERROR" ? NETWORK_ERROR_STATUS : error.statusCode;
    return new Response(error.message, { status });
  }

  return new Response("Erreur de chargement", { status: 500 });
}

// Pour les données secondaires d'une page : un échec ne doit pas faire tomber la page entière.
// Un AbortError est relancé (pas de fallback) pour ne pas afficher des données partielles après annulation.
export async function loaderFetchOptional<T>(
  endpoint: string,
  fallback: T,
  signal?: AbortSignal,
): Promise<T> {
  try {
    return await api.get<T>(endpoint, signal ? { signal } : undefined);
  } catch (error) {
    if (isAbortError(error)) throw error;
    logger.error(`[loader] ${endpoint} indisponible, repli :`, error);
    return fallback;
  }
}
