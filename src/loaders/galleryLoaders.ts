import type { LoaderFunctionArgs } from "react-router-dom";
import { api } from "../lib/api.ts";
import { parseQueryParams } from "./utils/parseQueryParams.ts";
import {
  withErrorHandling,
  withErrorHandlingAndThrow,
} from "./utils/withErrorHandling.ts";

/**
 * Interface pour les données de la page galerie
 */
export interface GalleryPageData {
  illustrations: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
}

/**
 * Interface pour les données de détail d'illustration
 */
export interface GalleryDetailData {
  illustration: unknown | null;
}

/**
 * Loader pour la page galerie avec pagination
 */
export const galleryPageLoader = withErrorHandling(
  async ({ request }: { request: Request }): Promise<GalleryPageData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(
      `/illustrations?limit=${limit}&offset=${offset}`,
    );

    return {
      illustrations: data?.data?.illustrations || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
    };
  },
  {
    illustrations: [],
    pagination: {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
  },
);

/**
 * Loader pour le détail d'une illustration par ID
 */
export const galleryDetailLoader = withErrorHandlingAndThrow(
  async ({ params }: LoaderFunctionArgs): Promise<GalleryDetailData> => {
    const id = params.id;
    if (!id) {
      throw new Response("ID manquant", { status: 400 });
    }

    const { data } = await api.get(`/illustrations/${id}`);

    return {
      illustration: data?.data?.illustration || null,
    };
  },
);




