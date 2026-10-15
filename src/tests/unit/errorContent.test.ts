import { describe, expect, it } from "vitest";
import { getErrorContent } from "../../components/pages/ErrorPage/errorContent";

describe("getErrorContent", () => {
  it.each([
    [400, "Requête invalide"],
    [401, "Connexion requise"],
    [403, "Accès non autorisé"],
    [404, "Page introuvable"],
    [429, "Trop de requêtes"],
    [503, "Serveur injoignable"],
    [500, "Erreur serveur"],
    [502, "Erreur serveur"],
    [418, "Requête impossible"],
    [null, "Oups !"],
  ])("statut %s → « %s »", (status, title) => {
    expect(getErrorContent(status).title).toBe(title);
  });

  it("propose la connexion sur un 401", () => {
    expect(getErrorContent(401).actions).toContain("login");
  });

  it("propose de réessayer sur une erreur serveur, pas sur un 404", () => {
    expect(getErrorContent(500).actions).toContain("retry");
    expect(getErrorContent(404).actions).not.toContain("retry");
  });

  it("propose toujours le retour à l'accueil", () => {
    for (const status of [400, 401, 403, 404, 429, 500, 503, 418, null]) {
      expect(getErrorContent(status).actions).toContain("home");
    }
  });
});
