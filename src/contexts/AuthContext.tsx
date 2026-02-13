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
  SignupCredentials,
} from "../types/auth";
import type { User } from "../types/users";
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Initialisation : vérifier si une session existe
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsInitializing(true);

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
        setIsInitializing(false);
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

  // ✍️ Inscription (auto-login côté backend)
  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      if (import.meta.env.DEV) {
        console.log("[Auth] Tentative d'inscription:", credentials.email);
      }

      const response = await apiClient("/auth/signup", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Le backend renvoie parfois { error: "..." }
        let message = "Erreur d'inscription";
        try {
          const data = await response.json();
          if (data?.error && typeof data.error === "string") {
            message = data.error;
          }
        } catch {
          // ignore
        }

        if (response.status === 409) {
          throw new Error(message);
        }

        if (response.status === 400) {
          throw new Error(message);
        }

        throw new Error(message);
      }

      const data: LoginResponse = await response.json();

      setAccessToken(data.accessToken);
      setUser(data.user);

      if (import.meta.env.DEV) {
        console.log("[Auth] Inscription réussie:", data.user.email);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur d'inscription";
      setError(message);

      if (import.meta.env.DEV) {
        console.error("[Auth] Erreur d'inscription:", message);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🚪 Déconnexion
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
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
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isInitializing,
    isLoading,
    error,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
