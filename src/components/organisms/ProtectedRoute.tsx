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
  const { user, isInitializing } = useAuth();
  const isAuthenticated = !!user;

  // Afficher un loader pendant la vérification
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Vérification de l'authentification...</div>
      </div>
    );
  }

  // Rediriger vers l'accueil si non authentifié (connexion via modale header)
  if (!isAuthenticated) {
    if (import.meta.env.DEV) {
      console.log("[ProtectedRoute] Non authentifié, redirection vers /");
    }
    return <Navigate to="/" replace />;
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
