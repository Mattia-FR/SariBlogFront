import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth();

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

  // Utilisateur authentifié, afficher le contenu
  return <>{children}</>;
}
