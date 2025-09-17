import useSWR from "swr";
import type { Article } from "../types/article";

export const useLatestArticles = (limit = 4, fallbackData?: Article[]) => {
  return useSWR(
    `/articles/latest?limit=${limit}`,
    null, // Utilise le fetcher global
    { fallbackData },
  );
};
