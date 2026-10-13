export type ErrorAction = "retry" | "login" | "gallery" | "home";

export interface ErrorContent {
  title: string;
  message: string;
  actions: ErrorAction[];
}

// Texte affiché selon le statut HTTP (null = erreur sans statut : rendu React, exception JS).
// Source unique pour ErrorPage, NotFoundPage, UnauthorizedPage et ErrorBoundary.
export function getErrorContent(status: number | null): ErrorContent {
  switch (status) {
    case 400:
      return {
        title: "Requête invalide",
        message: "L'adresse demandée contient un paramètre invalide.",
        actions: ["home"],
      };
    case 401:
      return {
        title: "Connexion requise",
        message: "Vous devez être connecté pour accéder à cette page.",
        actions: ["login", "home"],
      };
    case 403:
      return {
        title: "Accès non autorisé",
        message:
          "Cette zone est réservée aux utilisateurs ayant les droits d'accès. La galerie, elle, est ouverte à tous.",
        actions: ["gallery", "home"],
      };
    case 404:
      return {
        title: "Page introuvable",
        message:
          "Cette page n'existe pas ou n'est plus disponible. La galerie, elle, n'attend que vous.",
        actions: ["gallery", "home"],
      };
    case 429:
      return {
        title: "Trop de requêtes",
        message: "Patientez quelques instants avant de réessayer.",
        actions: ["retry", "home"],
      };
    case 503:
      return {
        title: "Serveur injoignable",
        message:
          "Le serveur ne répond pas. Vérifiez votre connexion puis réessayez.",
        actions: ["retry", "home"],
      };
    default:
      if (status !== null && status >= 500) {
        return {
          title: "Erreur serveur",
          message:
            "Le serveur a rencontré un problème. Réessayez dans quelques instants.",
          actions: ["retry", "home"],
        };
      }
      if (status !== null && status >= 400) {
        return {
          title: "Requête impossible",
          message: "La page n'a pas pu être chargée.",
          actions: ["retry", "home"],
        };
      }
      return {
        title: "Oups !",
        message:
          "Une erreur inattendue est survenue. Réessayez ou revenez à la page d'accueil.",
        actions: ["retry", "home"],
      };
  }
}
