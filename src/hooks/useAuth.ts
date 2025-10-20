/**
 * Hook personnalisé de gestion de l'authentification
 * 
 * Centralise toute la logique d'authentification de l'application :
 * - Vérification du token au chargement de l'app
 * - Connexion/déconnexion des utilisateurs
 * - Persistance dans localStorage (pas de sessionStorage pour l'UX)
 * - Gestion des permissions par rôle
 * 
 * Architecture : Ce hook est consommé par l'AuthContext pour exposer
 * l'état d'authentification à toute l'application sans prop drilling.
 */

import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { AuthError, AuthState, LoginCredentials } from "../types/auth";

// ===== CONSTANTES =====

/**
 * Clés de stockage localStorage
 * Préfixées "admin_" pour éviter les conflits avec d'autres apps sur le même domaine
 */
const AUTH_TOKEN_KEY = "admin_token";
const AUTH_USER_KEY = "admin_user";

// ===== HOOK PRINCIPAL =====

export const useAuth = () => {
  // État global de l'authentification
  const [authState, setAuthState] = useState<AuthState>({
    user: null,           // Données utilisateur (id, email, role)
    token: null,          // Token JWT pour les requêtes API
    isAuthenticated: false, // État de connexion
    isLoading: true,      // Indicateur de chargement initial
  });

  // ===== INITIALISATION AU CHARGEMENT =====

  /**
   * Vérifie si un token existe au démarrage de l'application
   * 
   * Processus :
   * 1. Lit le token depuis localStorage
   * 2. Si présent, vérifie sa validité auprès du serveur (/auth/verify)
   * 3. Si valide, restaure la session utilisateur
   * 4. Si invalide ou expiré, nettoie le localStorage
   * 
   * Cas d'usage : Permet de maintenir la session même après rechargement de la page
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userStr = localStorage.getItem(AUTH_USER_KEY);

      if (token && userStr) {
        try {
          // Vérification serveur : le token est-il encore valide ?
          const response = await api.get("/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = response.data.data.user;

          // Token valide → Restaurer la session
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          // Token invalide ou expiré → Nettoyer localStorage
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
        // Pas de token → État déconnecté
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []); // Exécuté une seule fois au montage du hook

  // ===== FONCTION DE CONNEXION =====

  /**
   * Authentifie un utilisateur avec email et mot de passe
   * 
   * Processus :
   * 1. Envoie les credentials au backend (/auth/login)
   * 2. Si succès, reçoit un token JWT et les infos utilisateur
   * 3. Stocke le token et les données user dans localStorage
   * 4. Met à jour l'état global d'authentification
   * 
   * @param credentials - Email et mot de passe de l'utilisateur
   * @returns Promise avec success: true ou error détaillée
   * 
   * @example
   * const { success, error } = await login({ 
   *   email: "admin@example.com", 
   *   password: "securepassword" 
   * });
   * if (!success) console.error(error.message);
   */
  const login = useCallback(
    async (
      credentials: LoginCredentials,
    ): Promise<{ success: boolean; error?: AuthError }> => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        // Appel API de connexion
        const response = await api.post("/auth/login", credentials);
        const { user, token } = response.data.data;

        // Persistance dans localStorage (survit au rechargement)
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

        // Mise à jour de l'état React
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } catch (error: unknown) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));

        // Extraction de l'erreur du format Axios
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
    [], // Pas de dépendances → Fonction stable
  );

  // ===== FONCTION DE DÉCONNEXION =====

  /**
   * Déconnecte l'utilisateur actuel
   * 
   * Processus :
   * 1. Appelle /auth/logout pour invalider le token côté serveur (optionnel)
   * 2. Nettoie localStorage (token et données user)
   * 3. Réinitialise l'état d'authentification
   * 
   * Note : Le nettoyage du localStorage se fait dans le finally pour garantir
   * la déconnexion côté client même si l'appel API échoue (ex: réseau coupé).
   */
  const logout = useCallback(async () => {
    try {
      // Tentative d'invalidation du token côté serveur
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
      // Ignorer les erreurs (le nettoyage local suffit pour la sécurité)
    } finally {
      // Nettoyage garanti même en cas d'échec API
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [authState.token]); // Re-créée seulement si le token change

  // ===== VÉRIFICATION DES PERMISSIONS =====

  /**
   * Vérifie si l'utilisateur possède un rôle spécifique
   * 
   * Utilisé pour afficher/masquer des éléments UI selon les permissions.
   * Ne remplace PAS la vérification côté serveur (toujours nécessaire).
   * 
   * @param role - Rôle ou liste de rôles autorisés (ex: "admin" ou ["admin", "editor"])
   * @returns true si l'utilisateur a l'un des rôles, false sinon
   * 
   * @example
   * {hasRole("admin") && <button>Supprimer</button>}
   * {hasRole(["admin", "editor"]) && <EditForm />}
   */
  const hasRole = useCallback(
    (role: string | string[]) => {
      if (!authState.user) return false; // Pas connecté → Pas de permissions

      const roles = Array.isArray(role) ? role : [role]; // Normaliser en array
      return roles.includes(authState.user.role); // Vérifier si le rôle correspond
    },
    [authState.user], // Re-créée seulement si l'utilisateur change
  );

  // ===== RETOUR DU HOOK =====

  /**
   * Expose l'état d'authentification et les fonctions utilitaires
   * 
   * Retour :
   * - user: Données utilisateur (null si déconnecté)
   * - token: JWT pour les requêtes API
   * - isAuthenticated: boolean rapide pour les conditions
   * - isLoading: Indicateur de chargement initial
   * - login(): Fonction de connexion
   * - logout(): Fonction de déconnexion
   * - hasRole(): Vérificateur de permissions
   */
  return {
    ...authState,
    login,
    logout,
    hasRole,
  };
};