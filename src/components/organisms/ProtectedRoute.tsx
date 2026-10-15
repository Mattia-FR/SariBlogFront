import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/users";
import { logger } from "../../utils/logger";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[]; // optionnel : si absent = seulement "connecté"
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isInitializing } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;

  // Afficher un loader pendant la vérification
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Vérification de l'authentification...</div>
      </div>
    );
  }

  // Non authentifié (ou session expirée) : connexion, puis retour à la page demandée
  if (!isAuthenticated) {
    logger.debug("[ProtectedRoute] Non authentifié, redirection vers /login");
    const redirect = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  // Rôle requis mais pas les bons
  if (allowedRoles !== undefined && allowedRoles.length > 0) {
    const hasAllowedRole = user && allowedRoles.includes(user.role);
    if (!hasAllowedRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Utilisateur authentifié, afficher le contenu
  return <>{children}</>;
}
