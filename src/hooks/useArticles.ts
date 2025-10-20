import useSWR from "swr";
import type { ArticlesPageData } from "../types/articlesPage";

export const useArticles = (
  limit = 12,
  offset = 0,
  fallbackData?: ArticlesPageData,
) => {
  return useSWR(`/articles?limit=${limit}&offset=${offset}`, null, {
    fallbackData,
  });
};
