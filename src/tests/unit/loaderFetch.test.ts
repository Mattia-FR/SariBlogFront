import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../utils/apiClient";
import { ApiError, NETWORK_ERROR_MESSAGE } from "../../utils/apiError";
import { loaderFetch, loaderFetchOptional } from "../../utils/loaderFetch";

vi.mock("../../utils/logger", () => ({
  logger: { debug: vi.fn(), error: vi.fn() },
}));

// Je mock le module apiClient pour simuler les appels HTTP sans jamais toucher le réseau.
// Ainsi, je contrôle parfaitement ce que retourne api.get().
vi.mock("../../utils/apiClient", () => ({
  api: {
    get: vi.fn(),
  },
}));

// Je récupère une référence typée au mock pour pouvoir utiliser mockResolvedValueOnce, etc.
const mockedApiGet = vi.mocked(api.get);

describe("loaderFetch", () => {
  // Avant chaque test, je réinitialise le mock pour qu'aucun appel ou configuration
  // d'un test précédent ne vienne perturber le test courant.
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  // Test du cas nominal : l'API répond correctement.
  it("returns data from api.get when request succeeds", async () => {
    // Arrange : je configure le mock pour qu'il renvoie une promesse résolue avec les données attendues.
    // Le `as never` n'est qu'une astuce TypeScript pour éviter une erreur de typage ; il ne change rien au comportement.
    mockedApiGet.mockResolvedValueOnce({ id: 1, title: "ok" } as never);

    // Act : j'appelle la fonction à tester, de manière asynchrone.
    const result = await loaderFetch<{ id: number; title: string }>(
      "/articles",
    );

    // Assert : je vérifie que la donnée reçue est bien celle retournée par l'API,
    // et que l'URL appelée est correcte.
    expect(result).toEqual({ id: 1, title: "ok" });
    expect(mockedApiGet).toHaveBeenCalledWith("/articles");
  });

  // Test d'une erreur HTTP 404 : la fonction doit transformer l'erreur en Response avec le bon statut.
  it("maps HTTP error message to Response status", async () => {
    // Arrange : le mock rejette avec une ApiError portant le statut HTTP.
    mockedApiGet.mockRejectedValueOnce(new ApiError(404, "Not Found"));

    // Act : j'appelle la fonction. Comme elle rejette, j'utilise `await expect(...).rejects`
    // pour tester le contenu de l'erreur.
    const call = loaderFetch("/articles/missing");

    // Assert : l'erreur doit être une instance de Response (car la fonction construit une Response),
    // et son statut doit être 404. `toMatchObject` vérifie partiellement l'objet.
    await expect(call).rejects.toMatchObject({ status: 404 });
    await expect(call).rejects.toBeInstanceOf(Response);
  });

  // Test d'une erreur générique (ex: réseau coupé) : la fonction doit retourner un statut 500.
  it("falls back to status 500 for generic Error", async () => {
    // Arrange : une erreur quelconque, sans code HTTP dans le message.
    mockedApiGet.mockRejectedValueOnce(new Error("Network down"));

    const call = loaderFetch("/articles");

    // Assert : la promesse doit être rejetée avec une Response de statut 500.
    await expect(call).rejects.toMatchObject({ status: 500 });
  });

  // Serveur injoignable : une Response ne peut pas avoir le statut 0, on utilise 503.
  it("maps NETWORK_ERROR to status 503", async () => {
    mockedApiGet.mockRejectedValueOnce(
      new ApiError(0, NETWORK_ERROR_MESSAGE, "NETWORK_ERROR"),
    );

    await expect(loaderFetch("/articles")).rejects.toMatchObject({
      status: 503,
    });
  });

  // Le message du backend doit être conservé dans le corps de la Response (lu par ErrorPage).
  it("keeps the backend message in the Response body", async () => {
    mockedApiGet.mockRejectedValueOnce(
      new ApiError(404, "Article introuvable", "NOT_FOUND"),
    );

    const error = await loaderFetch("/articles/slug/x").catch((e) => e);
    expect(error).toBeInstanceOf(Response);
    await expect((error as Response).text()).resolves.toBe(
      "Article introuvable",
    );
  });
});

describe("loaderFetchOptional", () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it("returns data when request succeeds", async () => {
    mockedApiGet.mockResolvedValueOnce([{ id: 1 }] as never);
    await expect(loaderFetchOptional("/tags", [])).resolves.toEqual([
      { id: 1 },
    ]);
  });

  // Donnée secondaire : un échec ne doit pas faire tomber la page, on renvoie le repli.
  it("returns the fallback instead of throwing", async () => {
    mockedApiGet.mockRejectedValueOnce(new ApiError(500, "Erreur serveur"));
    await expect(loaderFetchOptional("/tags", [])).resolves.toEqual([]);
  });
});
