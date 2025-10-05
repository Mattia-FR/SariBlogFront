import { api } from "../lib/api.ts";
import { parseQueryParams } from "./utils/parseQueryParams.ts";
import { withErrorHandling } from "./utils/withErrorHandling.ts";

/**
 * Interface pour les données de l'utilisateur admin
 */
export interface AdminUserData {
  user: unknown;
}

/**
 * Interface pour les données de la page admin articles
 */
export interface AdminArticlesData {
  articles: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
  tags: unknown[];
}

/**
 * Interface pour les données de la page admin illustrations
 */
export interface AdminIllustrationsData {
  illustrations: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
  tags: unknown[];
}

/**
 * Interface pour les données de la page admin messages
 */
export interface AdminMessagesData {
  messages: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
  };
}

/**
 * Interface pour les données de la page admin tags
 */
export interface AdminTagsData {
  tags: unknown[];
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    totalPages: number;
  };
}

/**
 * Interface pour les données de la page admin about
 */
export interface AdminAboutData {
  about: unknown | null;
  history: unknown[];
}

/**
 * Loader pour la protection admin - vérifie le token
 */
export const adminLoader = async (): Promise<AdminUserData> => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    throw new Response("Non autorisé", { status: 401 });
  }

  try {
    const response = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { user: response.data.data.user };
  } catch {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    throw new Response("Token invalide", { status: 401 });
  }
};

/**
 * Loader pour la page admin articles
 */
export const adminArticlesLoader = withErrorHandling(
  async ({ request }: { request: Request }): Promise<AdminArticlesData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(
      `/admin/articles?limit=${limit}&offset=${offset}`,
    );
    const { data: tagsData } = await api.get("/admin/tags");

    return {
      articles: data?.data?.articles || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
      tags: tagsData?.data?.tags || [],
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
    tags: [],
  },
);

/**
 * Loader pour la page admin illustrations
 */
export const adminIllustrationsLoader = withErrorHandling(
  async ({
    request,
  }: {
    request: Request;
  }): Promise<AdminIllustrationsData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(
      `/admin/illustrations?limit=${limit}&offset=${offset}`,
    );
    const { data: tagsData } = await api.get("/admin/illustrations/tags");

    return {
      illustrations: data?.data?.illustrations || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
      tags: tagsData?.data?.tags || [],
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
    tags: [],
  },
);

/**
 * Loader pour la page admin messages
 */
export const adminMessagesLoader = withErrorHandling(
  async ({ request }: { request: Request }): Promise<AdminMessagesData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(
      `/admin/messages?limit=${limit}&offset=${offset}`,
    );

    return {
      messages: data?.data?.messages || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
      stats: data?.data?.stats || {
        total: 0,
        unread: 0,
        read: 0,
      },
    };
  },
  {
    messages: [],
    pagination: {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
    stats: {
      total: 0,
      unread: 0,
      read: 0,
    },
  },
);

/**
 * Loader pour la page admin tags
 */
export const adminTagsLoader = withErrorHandling(
  async ({ request }: { request: Request }): Promise<AdminTagsData> => {
    const { limit, offset } = parseQueryParams(request, 12, 0);

    const { data } = await api.get(
      `/admin/tags?limit=${limit}&offset=${offset}`,
    );

    return {
      tags: data?.data?.tags || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
    };
  },
  {
    tags: [],
    pagination: {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
  },
);

/**
 * Loader pour la page admin about
 */
export const adminAboutLoader = withErrorHandling(
  async (): Promise<AdminAboutData> => {
    const { data } = await api.get("/admin/about");
    const { data: historyData } = await api.get("/admin/about/history");

    return {
      about: data?.data?.about || null,
      history: historyData?.data?.history || [],
    };
  },
  {
    about: null,
    history: [],
  },
);



