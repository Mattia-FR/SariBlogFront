import { ApiError } from "./apiError";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4242/api";

// Token stocké EN MEMOIRE (variable JS) - PAS de localStorage
let accessToken: string | null = null;

// Getters/Setters pour le token
export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

// Callback appelé quand le refresh échoue (session expirée)
let onAuthFailure: (() => void) | null = null;

export function setOnAuthFailure(handler: (() => void) | null): void {
  onAuthFailure = handler;
}

// Rafraîchit le token avec le refresh token (cookie httpOnly)
async function refreshAccessToken(): Promise<string | null> {
  try {
    if (import.meta.env.DEV) {
      console.log("[apiClient] Tentative de refresh du token");
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.log("[apiClient] Refresh échoué (", response.status, ")");
      }
      clearAccessToken();
      return null;
    }

    const data = await response.json();
    const newToken = data.accessToken;

    if (newToken) {
      setAccessToken(newToken);
      if (import.meta.env.DEV) {
        console.log("[apiClient] Token rafraîchi avec succès");
      }
      return newToken;
    }

    return null;
  } catch (error) {
    console.error("Erreur refresh token:", error);
    clearAccessToken();
    return null;
  }
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

  let response = await fetch(fullUrl, enrichedOptions);

  // Si 401 et qu'on a un token, tenter le refresh
  if (response.status === 401 && token) {
    if (import.meta.env.DEV) {
      console.log("[apiClient] 401 détecté, tentative de refresh");
    }

    const newToken = await refreshAccessToken();

    if (newToken) {
      if (import.meta.env.DEV) {
        console.log("[apiClient] Réessai avec le nouveau token");
      }
      headers.set("Authorization", `Bearer ${newToken}`);
      enrichedOptions.headers = headers;
      response = await fetch(fullUrl, enrichedOptions);
    } else {
      if (import.meta.env.DEV) {
        console.log("[apiClient] Refresh échoué");
      }
      clearAccessToken();
      onAuthFailure?.();
    }
  }

  return response;
}

// Lève une ApiError à partir du corps JSON d'erreur du back ({ error, code?, details? })
async function throwIfNotOk(response: Response): Promise<void> {
  if (response.ok) return;

  // Le corps n'est pas toujours du JSON (404 HTML d'Express, corps vide)
  const body = await response.json().catch(() => null);

  throw new ApiError(
    response.status,
    typeof body?.error === "string"
      ? body.error
      : `Erreur HTTP ${response.status}: ${response.statusText}`,
    body?.code,
    body?.details,
  );
}

// Méthodes utilitaires
export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await apiClient(endpoint, { method: "GET" });

    await throwIfNotOk(response);

    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });

    await throwIfNotOk(response);

    return response.json();
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

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await apiClient(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });

    await throwIfNotOk(response);

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await apiClient(endpoint, { method: "DELETE" });

    await throwIfNotOk(response);

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  },
};
