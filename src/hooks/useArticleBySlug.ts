import useSWR from "swr";
import type { ArticleDetail } from "../types/articleDetail";

export const useArticleBySlug = (
  slug: string,
  fallbackData?: ArticleDetail,
) => {
  return useSWR(
    slug ? `/articles/slug/${slug}` : null,
    null, // Utilise le fetcher global
    { fallbackData },
  );
};
