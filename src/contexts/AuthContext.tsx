import { createContext, type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { User } from "../types/users";
import {
  api,
  apiClient,
  clearAccessToken,
  refreshAccessToken,
  setAccessToken,
  setOnAuthFailure,
} from "../utils/apiClient";
import { logger } from "../utils/logger";

interface AuthContextValue {
  user: User | null;
  isInitializing: boolean;
  isLoading: boolean;
  setCurrentUser: (user: User) => void;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Propager l'échec du refresh vers le contexte (session expirée).
  // ProtectedRoute redirige ensuite vers /login?redirect=… dès que `user` vaut null.
  useEffect(() => {
    setOnAuthFailure(() => {
      setUser(null);
      toast.error("Session expirée, veuillez vous reconnecter");
    });
    return () => setOnAuthFailure(null);
  }, []);

  // Vérifier si une session existe au chargement.
  // `refreshAccessToken` est single-flight : le double effet du StrictMode ne lance qu'un refresh.
  useEffect(() => {
    async function checkSession() {
      try {
        const token = await refreshAccessToken();
        if (!token) return; // Visiteur sans session : cas normal

        const currentUser = await api.get<User>("/admin/users/me");
        setUser(currentUser);
      } catch (err) {
        // Session présente mais profil illisible : on repart d'un état déconnecté cohérent
        logger.error("[AuthContext] Restauration de session impossible :", err);
        clearAccessToken();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    checkSession();
  }, []);

  async function login(identifier: string, password: string) {
    try {
      setIsLoading(true);

      const data = await api.post<{ accessToken: string; user: User }>(
        "/auth/login",
        { identifier, password },
      );
      setAccessToken(data.accessToken);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      await apiClient("/auth/logout", { method: "POST" });
    } catch (err) {
      logger.error("[AuthContext] Erreur déconnexion :", err);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      clearAccessToken();
      setUser(null);
      setIsLoading(false);
    }
  }

  function setCurrentUser(currentUser: User) {
    setUser(currentUser);
  }

  const value = {
    user,
    isInitializing,
    isLoading,
    setCurrentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
