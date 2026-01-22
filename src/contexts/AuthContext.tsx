import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  AuthContextValue,
  LoginCredentials,
  LoginResponse,
  User,
} from "../types/auth";
import {
  api,
  apiClient,
  clearAccessToken,
  setAccessToken,
} from "../utils/apiClient";

// Création du contexte
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Initialisation : vérifier si une session existe
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

        if (import.meta.env.DEV) {
          console.log("[Auth] Initialisation...");
        }

        // Tenter de récupérer l'utilisateur via le refresh token (cookie)
        const response = await apiClient("/auth/refresh", { method: "POST" });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);

          if (import.meta.env.DEV) {
            console.log(
              "[Auth] Refresh token valide, récupération utilisateur",
            );
          }

          // Récupérer les infos utilisateur
          const currentUser = await api.get<User>("/users/me");
          setUser(currentUser);

          if (import.meta.env.DEV) {
            console.log("[Auth] Connecté en tant que:", currentUser.email);
          }
        } else {
          if (import.meta.env.DEV) {
            console.log("[Auth] Pas de session valide");
          }
        }
      } catch (err) {
        // Pas de session valide
        if (import.meta.env.DEV) {
          console.log("[Auth] Erreur d'initialisation:", err);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔑 Connexion
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        console.log("[Auth] Tentative de connexion:", credentials.identifier);
      }

      const response = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Email/nom d'utilisateur ou mot de passe incorrect");
        }
        throw new Error("Erreur de connexion");
      }

      const data: LoginResponse = await response.json();

      // Stocker le token EN MEMOIRE
      setAccessToken(data.accessToken);
      setUser(data.user);

      if (import.meta.env.DEV) {
        console.log("[Auth] Connexion réussie:", data.user.email);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      setError(message);

      if (import.meta.env.DEV) {
        console.error("[Auth] Erreur de connexion:", message);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🚪 Déconnexion
  const logout = useCallback(async () => {
    try {
      if (import.meta.env.DEV) {
        console.log("[Auth] Déconnexion...");
      }

      await apiClient("/auth/logout", { method: "POST" });

      if (import.meta.env.DEV) {
        console.log("[Auth] Déconnexion réussie");
      }
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    } finally {
      clearAccessToken();
      setUser(null);
      setError(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };

  // Loader pendant l'initialisation
  if (isLoading && user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
