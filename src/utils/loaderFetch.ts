import { api } from "./apiClient";
import { ApiError } from "./apiError";

export async function loaderFetch<T>(endpoint: string): Promise<T> {
  try {
    return await api.get<T>(endpoint);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    const status = error instanceof ApiError ? error.statusCode : 500;
    throw new Response("Erreur de chargement", { status });
  }
}
