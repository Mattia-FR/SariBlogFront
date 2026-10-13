import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  api,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
  setOnAuthFailure,
} from "../../utils/apiClient";
import { ApiError } from "../../utils/apiError";

// Je coupe les logs de développement pour garder une sortie de test lisible.
vi.mock("../../utils/logger", () => ({
  logger: { debug: vi.fn(), error: vi.fn() },
}));

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function authorizationOf(init?: RequestInit): string | null {
  return new Headers(init?.headers).get("Authorization");
}

function refreshCalls(): number {
  return fetchMock.mock.calls.filter(([url]) =>
    String(url).endsWith("/auth/refresh"),
  ).length;
}

describe("apiClient", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    clearAccessToken();
    setOnAuthFailure(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("partage un seul refresh entre deux 401 simultanés (single-flight)", async () => {
    setAccessToken("ancien");
    fetchMock.mockImplementation(async (url, init) => {
      if (String(url).endsWith("/auth/refresh")) {
        // Le refresh prend un peu de temps : les deux requêtes l'attendent en même temps.
        await new Promise((resolve) => setTimeout(resolve, 10));
        return jsonResponse({ accessToken: "nouveau" });
      }
      return authorizationOf(init) === "Bearer nouveau"
        ? jsonResponse({ ok: true })
        : jsonResponse(
            { error: "Token invalide", code: "UNAUTHENTICATED" },
            401,
          );
    });

    const [a, b] = await Promise.all([
      api.get("/admin/a"),
      api.get("/admin/b"),
    ]);

    expect(a).toEqual({ ok: true });
    expect(b).toEqual({ ok: true });
    expect(refreshCalls()).toBe(1);
    expect(getAccessToken()).toBe("nouveau");
  });

  it("appelle onAuthFailure une seule fois quand le refresh échoue", async () => {
    const onAuthFailure = vi.fn();
    setOnAuthFailure(onAuthFailure);
    setAccessToken("expiré");
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith("/auth/refresh")
        ? jsonResponse({ error: "Refresh invalide" }, 401)
        : jsonResponse(
            { error: "Token invalide", code: "UNAUTHENTICATED" },
            401,
          ),
    );

    const results = await Promise.allSettled([
      api.get("/admin/a"),
      api.get("/admin/b"),
    ]);

    expect(results.every((r) => r.status === "rejected")).toBe(true);
    expect(onAuthFailure).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
  });

  it("ne déclenche pas onAuthFailure pour un visiteur sans session", async () => {
    const onAuthFailure = vi.fn();
    setOnAuthFailure(onAuthFailure);
    fetchMock.mockResolvedValue(jsonResponse({ error: "Non connecté" }, 401));

    await expect(api.get("/admin/a")).rejects.toBeInstanceOf(ApiError);
    expect(onAuthFailure).not.toHaveBeenCalled();
  });

  it("ne tente pas de refresh sur les routes /auth/ (401 = identifiants invalides)", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: "Identifiants invalides", code: "UNAUTHENTICATED" },
        401,
      ),
    );

    await expect(api.post("/auth/login", {})).rejects.toMatchObject({
      statusCode: 401,
      message: "Identifiants invalides",
    });
    expect(refreshCalls()).toBe(0);
  });

  it("transforme une panne réseau en ApiError NETWORK_ERROR", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(api.get("/articles")).rejects.toMatchObject({
      statusCode: 0,
      code: "NETWORK_ERROR",
    });
  });

  it("laisse passer une annulation (AbortError) sans la convertir", async () => {
    fetchMock.mockRejectedValue(new DOMException("Aborted", "AbortError"));

    await expect(api.get("/articles")).rejects.toMatchObject({
      name: "AbortError",
    });
  });

  it("lit le message, le code et les détails du contrat d'erreur", async () => {
    const details = [{ path: ["email"], message: "Email invalide" }];
    fetchMock.mockResolvedValue(
      jsonResponse(
        { error: "Données invalides", code: "VALIDATION_ERROR", details },
        400,
      ),
    );

    await expect(api.post("/messages", {})).rejects.toMatchObject({
      statusCode: 400,
      message: "Données invalides",
      code: "VALIDATION_ERROR",
      details,
    });
  });

  it("produit un message de repli quand le corps n'est pas du JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response("<html>Bad Gateway</html>", {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );

    await expect(api.get("/articles")).rejects.toMatchObject({
      statusCode: 502,
      message: "Erreur HTTP 502: Bad Gateway",
      code: undefined,
    });
  });

  it("renvoie undefined pour une réponse 204", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.delete("/admin/tags/1")).resolves.toBeUndefined();
  });
});
