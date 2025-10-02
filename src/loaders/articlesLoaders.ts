import type { LoaderFunctionArgs } from "react-router-dom";
import { api } from "../lib/api.ts";
import { parseQueryParams } from "./utils/parseQueryParams.ts";
import {
  withErrorHandling,
  withErrorHandlingAndThrow,
} from "./utils/withErrorHandling.ts";

/**
 * Interface pour les données de la page articles
 */
export interface ArticlesPageData {
  articles: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
}

/**
 * Interface pour les données de détail d'article
 */
export interface ArticleDetailData {
  article: unknown | null;
}

/**
 * Loader pour la page des articles avec pagination
 */
export const articlesPageLoader = withErrorHandling(
  async ({ request }: { request: Request }): Promise<ArticlesPageData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(`/articles?limit=${limit}&offset=${offset}`);

    return {
      articles: data?.data?.articles || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
    };
  },
  {
    articles: [],
    pagination: {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
  },
);

/**
 * Loader pour le détail d'un article par slug
 */
export const articleDetailLoader = withErrorHandlingAndThrow(
  async ({ params }: LoaderFunctionArgs): Promise<ArticleDetailData> => {
    const slug = params.slug;
    if (!slug) {
      throw new Response("Slug manquant", { status: 400 });
    }

    const { data } = await api.get(`/articles/slug/${slug}`);

    return {
      article: data?.data?.article || null,
    };
  },
);
