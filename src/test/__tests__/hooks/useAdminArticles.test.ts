import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useAdminArticles } from "../../../hooks/useAdminArticles";
import { api } from "../../../lib/api";
import {
  mockApiError,
  mockApiResponse,
  mockArticle,
} from "../../utils/test-utils";

// Mock de l'API
const mockApi = api as any;

describe("useAdminArticles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useAdminArticles", () => {
    it("devrait récupérer la liste des articles", async () => {
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

      const { result } = renderHook(() => useAdminArticles());

      await waitFor(() => {
        expect(result.current.articles).toEqual(mockArticles);
      });

      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("devrait gérer les erreurs de récupération", async () => {
      mockApi.get.mockRejectedValue(mockApiError(500, "Erreur serveur"));

      const { result } = renderHook(() => useAdminArticles());

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.articles).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it("devrait créer un nouvel article", async () => {
      const newArticleData = {
        title: "Nouvel article",
        excerpt: "Extrait",
        content: "Contenu",
        image: "image.jpg",
        status: "published" as const,
        tagIds: [1, 2],
      };

      const createdArticle = { ...mockArticle, ...newArticleData };

      mockApi.post.mockResolvedValue(
        mockApiResponse({ article: createdArticle }),
      );

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.createArticle(newArticleData);
        expect(response.success).toBe(true);
      });

      expect(mockApi.post).toHaveBeenCalledWith(
        "/admin/articles",
        newArticleData,
      );
    });

    it("devrait mettre à jour un article existant", async () => {
      const updateData = {
        title: "Article modifié",
        excerpt: "Extrait modifié",
        content: "Contenu modifié",
        image: "new-image.jpg",
        status: "published" as const,
        tagIds: [1],
      };

      const updatedArticle = { ...mockArticle, ...updateData };

      mockApi.put.mockResolvedValue(
        mockApiResponse({ article: updatedArticle }),
      );

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.updateArticle(1, updateData);
        expect(response.success).toBe(true);
      });

      expect(mockApi.put).toHaveBeenCalledWith("/admin/articles/1", updateData);
    });

    it("devrait supprimer un article", async () => {
      mockApi.delete.mockResolvedValue(mockApiResponse({}));

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.deleteArticle(1);
        expect(response.success).toBe(true);
      });

      expect(mockApi.delete).toHaveBeenCalledWith("/admin/articles/1");
    });

    it("devrait gérer les erreurs de création", async () => {
      const newArticleData = {
        title: "Nouvel article",
        excerpt: "Extrait",
        content: "Contenu",
        image: "image.jpg",
        status: "published" as const,
        tagIds: [1, 2],
      };

      mockApi.post.mockRejectedValue(mockApiError(400, "Données invalides"));

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.createArticle(newArticleData);
        expect(response.success).toBe(false);
        expect(response.error?.message).toBe("Données invalides");
      });
    });

    it("devrait gérer les erreurs de mise à jour", async () => {
      const updateData = {
        title: "Article modifié",
        excerpt: "Extrait modifié",
        content: "Contenu modifié",
        image: "new-image.jpg",
        status: "published" as const,
        tagIds: [1],
      };

      mockApi.put.mockRejectedValue(mockApiError(404, "Article non trouvé"));

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.updateArticle(999, updateData);
        expect(response.success).toBe(false);
        expect(response.error?.message).toBe("Article non trouvé");
      });
    });

    it("devrait gérer les erreurs de suppression", async () => {
      mockApi.delete.mockRejectedValue(mockApiError(404, "Article non trouvé"));

      const { result } = renderHook(() => useAdminArticles());

      await act(async () => {
        const response = await result.current.deleteArticle(999);
        expect(response.success).toBe(false);
        expect(response.error?.message).toBe("Article non trouvé");
      });
    });

    it("devrait recharger les articles après une opération", async () => {
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

      const { result } = renderHook(() => useAdminArticles());

      await waitFor(() => {
        expect(result.current.articles).toEqual(mockArticles);
      });

      // Simuler une création d'article
      const newArticleData = {
        title: "Nouvel article",
        excerpt: "Extrait",
        content: "Contenu",
        image: "image.jpg",
        status: "published" as const,
        tagIds: [1, 2],
      };

      mockApi.post.mockResolvedValue(
        mockApiResponse({ article: { ...mockArticle, ...newArticleData } }),
      );

      await act(async () => {
        await result.current.createArticle(newArticleData);
      });

      // Vérifier que les articles ont été rechargés
      expect(mockApi.get).toHaveBeenCalledTimes(2);
    });
  });
});
