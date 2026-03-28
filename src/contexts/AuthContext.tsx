import { createContext, type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { User } from "../types/users";
import {
  api,
  apiClient,
  clearAccessToken,
  setAccessToken,
} from "../utils/apiClient";

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

  // Vérifier si une session existe au chargement
  useEffect(() => {
    async function checkSession() {
      try {
        const response = await apiClient("/auth/refresh", { method: "POST" });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);

          const currentUser = await api.get<User>("/admin/users/me");
          setUser(currentUser);
        }
      } catch {
        console.error("Pas de session valide");
      } finally {
        setIsInitializing(false);
      }
    }

    checkSession();
  }, []);

  async function login(identifier: string, password: string) {
    try {
      setIsLoading(true);

      const response = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        throw new Error("Email/nom d'utilisateur ou mot de passe incorrect");
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch (err) {
      console.error("Erreur de connexion:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoading(true);
      await apiClient("/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Erreur déconnexion:", err);
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
