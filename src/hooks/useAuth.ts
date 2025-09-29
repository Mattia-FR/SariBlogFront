import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { AuthError, AuthState, LoginCredentials } from "../types/auth";

const AUTH_TOKEN_KEY = "admin_token";
const AUTH_USER_KEY = "admin_user";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialiser l'auth au chargement
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(AUTH_USER_KEY);

      if (token && userStr) {
        try {
          // Vérifier si le token est encore valide
          const response = await api.get("/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = response.data.data.user;
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<{ success: boolean; error?: AuthError }> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await api.post("/auth/login", credentials);
        const { user, token } = response.data.data;

        // Sauvegarder dans localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

        // Mettre à jour l'état
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } catch (error: unknown) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));

        const axiosError = error as {
          response?: { data?: { error?: AuthError } };
        };
        const errorData = axiosError.response?.data?.error;

        return {
          success: false,
          error: {
            code: errorData?.code || "LOGIN_ERROR",
            message: errorData?.message || "Erreur de connexion",
          },
        };
      }
    },
    [],
  );

  // Fonction de déconnexion
  const logout = useCallback(async () => {
    try {
      // Appeler l'API de déconnexion si nécessaire
      if (authState.token) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          },
        );
      }
    } catch {
      // Ignorer les erreurs de déconnexion
    } finally {
      // Nettoyer le localStorage et l'état
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [authState.token]);

  // Fonction pour vérifier les permissions
  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!authState.user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(authState.user.role);
    },
    [authState.user],
  );

  return {
    ...authState,
    login,
    logout,
    hasRole,
  };
};
