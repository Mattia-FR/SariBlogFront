import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useArticles } from "../../../hooks/useArticles";
import { api } from "../../../lib/api";
import {
  mockApiError,
  mockApiResponse,
  mockArticle,
} from "../../utils/test-utils";

// Mock de l'API
const mockApi = api as any;

describe("useArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait récupérer les articles avec pagination", async () => {
    const mockArticles = [mockArticle];
    const mockPagination = {
      limit: 10,
      offset: 0,
      totalCount: 1,
      totalPages: 1,
    };

    mockApi.get.mockResolvedValue(
      mockApiResponse({
        articles: mockArticles,
        pagination: mockPagination,
      }),
    );

    const { result } = renderHook(() => useArticles(10, 0));

    await waitFor(() => {
      expect(result.current.articles).toEqual(mockArticles);
    });

    expect(result.current.pagination).toEqual(mockPagination);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockApi.get).toHaveBeenCalledWith("/articles?limit=10&offset=0");
  });

  it("devrait gérer les erreurs de récupération", async () => {
    mockApi.get.mockRejectedValue(mockApiError(500, "Erreur serveur"));

    const { result } = renderHook(() => useArticles(10, 0));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.articles).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("devrait utiliser les paramètres de pagination par défaut", async () => {
    mockApi.get.mockResolvedValue(
      mockApiResponse({
        articles: [],
        pagination: { limit: 10, offset: 0, totalCount: 0, totalPages: 0 },
      }),
    );

    renderHook(() => useArticles());

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith("/articles?limit=10&offset=0");
    });
  });

  it("devrait mettre à jour les paramètres de pagination", async () => {
    const { result, rerender } = renderHook(
      ({ limit, offset }) => useArticles(limit, offset),
      { initialProps: { limit: 10, offset: 0 } },
    );

    mockApi.get.mockResolvedValue(
      mockApiResponse({
        articles: [],
        pagination: { limit: 20, offset: 20, totalCount: 0, totalPages: 0 },
      }),
    );

    rerender({ limit: 20, offset: 20 });

    await waitFor(() => {
      expect(mockApi.get).toHaveBeenCalledWith("/articles?limit=20&offset=20");
    });
  });
});
