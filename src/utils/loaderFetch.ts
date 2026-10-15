import { api } from "./apiClient";
import { ApiError } from "./apiError";
import { logger } from "./logger";

// Statut utilisé quand le serveur est injoignable (une Response ne peut pas porter le statut 0).
const NETWORK_ERROR_STATUS = 503;

// Pour les loaders React Router : toute erreur devient une `Response` (statut + message backend),
// lue ensuite par `ErrorPage` via `useRouteError()`.
export async function loaderFetch<T>(endpoint: string): Promise<T> {
  try {
    return await api.get<T>(endpoint);
  } catch (error) {
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
export async function loaderFetchOptional<T>(
  endpoint: string,
  fallback: T,
): Promise<T> {
  try {
    return await api.get<T>(endpoint);
  } catch (error) {
    logger.error(`[loader] ${endpoint} indisponible, repli :`, error);
    return fallback;
  }
}
