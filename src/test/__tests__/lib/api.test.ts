import { vi } from "vitest";
import { api } from "../../lib/api";

// Mock d'axios
const mockAxios = {
  create: vi.fn(() => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
};

vi.mock("axios", () => mockAxios);

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("devrait être configuré avec la bonne URL de base", () => {
    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:3000/api",
    });
  });

  it("devrait ajouter le token d'autorisation aux requêtes", () => {
    const token = "test-token";
    localStorage.setItem("admin_token", token);

    // Simuler une requête
    const mockRequest = {
      headers: {},
    };

    // Récupérer la fonction d'intercepteur de requête
    const requestInterceptor =
      mockAxios.create().interceptors.request.use.mock.calls[0][0];

    const result = requestInterceptor(mockRequest);

    expect(result.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("devrait ne pas ajouter de token si aucun n'est stocké", () => {
    const mockRequest = {
      headers: {},
    };

    const requestInterceptor =
      mockAxios.create().interceptors.request.use.mock.calls[0][0];
    const result = requestInterceptor(mockRequest);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it("devrait gérer les erreurs 401 en nettoyant le localStorage", () => {
    const mockError = {
      response: {
        status: 401,
      },
    };

    localStorage.setItem("admin_token", "test-token");
    localStorage.setItem("admin_user", "test-user");

    // Récupérer la fonction d'intercepteur de réponse
    const responseInterceptor =
      mockAxios.create().interceptors.response.use.mock.calls[0][1];

    // Simuler la redirection
    const mockLocation = { pathname: "/admin/dashboard" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    expect(() => responseInterceptor(mockError)).toThrow();

    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("admin_user");
  });

  it("devrait rediriger vers /admin/login en cas d'erreur 401 sur une page admin", () => {
    const mockError = {
      response: {
        status: 401,
      },
    };

    const mockLocation = { pathname: "/admin/dashboard" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    const responseInterceptor =
      mockAxios.create().interceptors.response.use.mock.calls[0][1];

    expect(() => responseInterceptor(mockError)).toThrow();
    expect(window.location.href).toBe("/admin/login");
  });

  it("ne devrait pas rediriger si on n'est pas sur une page admin", () => {
    const mockError = {
      response: {
        status: 401,
      },
    };

    const mockLocation = { pathname: "/articles" };
    Object.defineProperty(window, "location", {
      value: mockLocation,
      writable: true,
    });

    const responseInterceptor =
      mockAxios.create().interceptors.response.use.mock.calls[0][1];

    expect(() => responseInterceptor(mockError)).toThrow();
    expect(window.location.href).toBe("/articles");
  });

  it("devrait passer les erreurs non-401 sans modification", () => {
    const mockError = {
      response: {
        status: 500,
      },
    };

    const responseInterceptor =
      mockAxios.create().interceptors.response.use.mock.calls[0][1];

    expect(() => responseInterceptor(mockError)).toThrow();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });

  it("devrait passer les réponses réussies sans modification", () => {
    const mockResponse = {
      data: { success: true },
    };

    const responseInterceptor =
      mockAxios.create().interceptors.response.use.mock.calls[0][0];
    const result = responseInterceptor(mockResponse);

    expect(result).toBe(mockResponse);
  });
});
