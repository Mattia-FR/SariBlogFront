import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/users";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[]; // optionnel : si absent = seulement "connecté"
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, user } = useAuth();

  // Logs pendant le développement
  if (import.meta.env.DEV) {
    console.log(
      "[ProtectedRoute] isInitializing:",
      isInitializing,
      "isAuthenticated:",
      isAuthenticated,
    );
  }

  // Afficher un loader pendant la vérification
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Vérification de l'authentification...</div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    if (import.meta.env.DEV) {
      console.log("[ProtectedRoute] Non authentifié, redirection vers /login");
    }
    return <Navigate to="/login" replace />;
  }

  // Rôle requis mais pas les bons
  if (allowedRoles !== undefined && allowedRoles.length > 0) {
    const hasAllowedRole = user && allowedRoles.includes(user.role);
    if (!hasAllowedRole) {
      return <Navigate to="/" replace />; // ou vers /unauthorized
    }
  }

  // Utilisateur authentifié, afficher le contenu
  return <>{children}</>;
}
