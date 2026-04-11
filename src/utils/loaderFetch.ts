import { api } from "./apiClient";

function extractStatusFromError(error: Error): number {
  const match = error.message.match(/Erreur HTTP (\d+)/);
  return match ? Number(match[1]) : 500;
}

export async function loaderFetch<T>(endpoint: string): Promise<T> {
  try {
    return await api.get<T>(endpoint);
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    if (error instanceof Error) {
      throw new Response("Erreur de chargement", {
        status: extractStatusFromError(error),
      });
    }

    throw new Response("Erreur serveur", { status: 500 });
  }
}
