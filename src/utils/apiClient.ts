import { ApiError, type ErrorCode, NETWORK_ERROR_MESSAGE } from "./apiError";
import { logger } from "./logger";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4242/api";

// Token stocké EN MEMOIRE (variable JS) - PAS de localStorage
let accessToken: string | null = null;

// Callback appelé quand le refresh échoue alors qu'une session existait (session expirée).
// Appelé une seule fois par session, même si plusieurs requêtes échouent en même temps.
let onAuthFailure: (() => void) | null = null;
let authFailureNotified = false;

// Getters/Setters pour le token
export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
  authFailureNotified = false;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function setOnAuthFailure(handler: (() => void) | null): void {
  onAuthFailure = handler;
}

function notifyAuthFailure(): void {
  if (authFailureNotified) return;
  authFailureNotified = true;
  onAuthFailure?.();
}

// `fetch` qui transforme une panne réseau (serveur coupé, CORS, hors ligne) en ApiError typée.
async function fetchOrThrow(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    logger.error("[apiClient] Erreur réseau :", err);
    throw new ApiError(0, NETWORK_ERROR_MESSAGE, "NETWORK_ERROR");
  }
}

async function doRefresh(): Promise<string | null> {
  logger.debug("[apiClient] Tentative de refresh du token");
  try {
    const response = await fetchOrThrow(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      logger.debug("[apiClient] Refresh échoué (", response.status, ")");
      clearAccessToken();
      return null;
    }

    const data = await response.json();
    const newToken: unknown = data?.accessToken;
    if (typeof newToken !== "string" || !newToken) {
      clearAccessToken();
      return null;
    }

    setAccessToken(newToken);
    logger.debug("[apiClient] Token rafraîchi avec succès");
    return newToken;
  } catch (err) {
    logger.error("[apiClient] Erreur refresh token :", err);
    clearAccessToken();
    return null;
  }
}

// Refresh en single-flight : le refresh token tourne à chaque appel côté back,
// donc deux refresh simultanés invalideraient la session. Tous les appelants
// concurrents partagent la même promesse.
let refreshPromise: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Client API principal
export async function apiClient(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const token = getAccessToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Si on envoie un FormData (upload multipart), on laisse le navigateur définir
  // `multipart/form-data` + `boundary`. Sinon, on sérialise en JSON.
  const isFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormDataBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const enrichedOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let response = await fetchOrThrow(fullUrl, enrichedOptions);

  // Sur 401 (hors routes d'auth, où 401 a un sens métier), tenter un refresh puis rejouer une fois.
  if (response.status === 401 && !url.startsWith("/auth/")) {
    logger.debug("[apiClient] 401 détecté, tentative de refresh");
    const newToken = await refreshAccessToken();

    if (newToken) {
      logger.debug("[apiClient] Réessai avec le nouveau token");
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetchOrThrow(fullUrl, { ...enrichedOptions, headers });
    } else if (token) {
      // Une session existait et n'a pas pu être prolongée : session expirée.
      notifyAuthFailure();
    }
  }

  return response;
}

// Lève une ApiError à partir du corps JSON d'erreur du back ({ error, code, details? })
async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) return;

  // Le corps n'est pas toujours du JSON (proxy, page HTML, corps vide)
  const body = await response.json().catch(() => null);

  throw new ApiError(
    response.status,
    typeof body?.error === "string"
      ? body.error
      : `Erreur HTTP ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`,
    typeof body?.code === "string" ? (body.code as ErrorCode) : undefined,
    body?.details,
  );
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

function jsonBody(data: unknown): string | undefined {
  return data !== undefined ? JSON.stringify(data) : undefined;
}

// Méthodes utilitaires : lèvent une ApiError sur toute réponse non-OK ou panne réseau.
export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await apiClient(endpoint, { method: "GET" });
    await throwIfNotOk(response);
    return parseBody<T>(response);
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient(endpoint, {
      method: "POST",
      body: jsonBody(data),
    });
    await throwIfNotOk(response);
    return parseBody<T>(response);
  },

  /* POST avec FormData (ex. upload de fichier avec multer) : on n'envoie pas Content-Type
  pour que le navigateur mette multipart/form-data + boundary
  apiClient ne met pas application/json quand le body est un FormData */
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await apiClient(endpoint, {
      method: "POST",
      body: formData,
    });
    await throwIfNotOk(response);
    return parseBody<T>(response);
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient(endpoint, {
      method: "PATCH",
      body: jsonBody(data),
    });
    await throwIfNotOk(response);
    return parseBody<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await apiClient(endpoint, { method: "DELETE" });
    await throwIfNotOk(response);
    return parseBody<T>(response);
  },
};
