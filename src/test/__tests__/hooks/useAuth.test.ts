import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../lib/api";
import {
  mockApiError,
  mockApiResponse,
  mockUser,
  mockValidToken,
} from "../../utils/test-utils";

// Mock de l'API
const mockApi = api as any;

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("devrait initialiser avec un état non authentifié", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(result.current.isLoading).toBe(true);
  });

  it("devrait initialiser avec un utilisateur connecté si le token est valide", async () => {
    localStorage.setItem("admin_token", mockValidToken);
    localStorage.setItem("admin_user", JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockValidToken);
  });

  it("devrait nettoyer le localStorage si le token est invalide", async () => {
    localStorage.setItem("admin_token", "invalid-token");
    localStorage.setItem("admin_user", JSON.stringify(mockUser));

    mockApi.get.mockRejectedValue(mockApiError(401, "Token invalide"));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_user");
  });

  it("devrait se connecter avec succès", async () => {
    const credentials = {
      email: "test@test.com",
      password: "password123",
    };

    mockApi.post.mockResolvedValue(
      mockApiResponse({
        user: mockUser,
        token: mockValidToken,
      }),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login(credentials);

      expect(loginResult.success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockValidToken);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "admin_token",
      mockValidToken,
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "admin_user",
      JSON.stringify(mockUser),
    );
  });

  it("devrait gérer les erreurs de connexion", async () => {
    const credentials = {
      email: "wrong@test.com",
      password: "wrongpassword",
    };

    mockApi.post.mockRejectedValue(
      mockApiError(401, "Email ou mot de passe incorrect"),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login(credentials);

      expect(loginResult.success).toBe(false);
      expect(loginResult.error?.code).toBe("API_ERROR");
      expect(loginResult.error?.message).toBe(
        "Email ou mot de passe incorrect",
      );
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it("devrait se déconnecter correctement", async () => {
    // Simuler un utilisateur connecté
    localStorage.setItem("admin_token", mockValidToken);
    localStorage.setItem("admin_user", JSON.stringify(mockUser));

    mockApi.post.mockResolvedValue(mockApiResponse({}));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_user");
  });

  it("devrait gérer les erreurs de déconnexion", async () => {
    localStorage.setItem("admin_token", mockValidToken);
    localStorage.setItem("admin_user", JSON.stringify(mockUser));

    mockApi.post.mockRejectedValue(mockApiError(500, "Erreur serveur"));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    // Même en cas d'erreur, la déconnexion locale doit se faire
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_user");
  });

  it("devrait vérifier les permissions correctement", () => {
    const { result } = renderHook(() => useAuth());

    // Sans utilisateur connecté
    expect(result.current.hasRole("admin")).toBe(false);
    expect(result.current.hasRole(["admin", "editor"])).toBe(false);

    // Simuler un utilisateur admin
    act(() => {
      result.current.user = mockUser;
    });

    expect(result.current.hasRole("admin")).toBe(true);
    expect(result.current.hasRole("editor")).toBe(false);
    expect(result.current.hasRole(["admin", "editor"])).toBe(true);
  });

  it("devrait gérer les erreurs réseau", async () => {
    const credentials = {
      email: "test@test.com",
      password: "password123",
    };

    mockApi.post.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const loginResult = await result.current.login(credentials);

      expect(loginResult.success).toBe(false);
      expect(loginResult.error?.code).toBe("LOGIN_ERROR");
      expect(loginResult.error?.message).toBe("Erreur de connexion");
    });
  });
});
