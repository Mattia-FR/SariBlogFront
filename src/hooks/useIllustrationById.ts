import useSWR from "swr";
import type { IllustrationDetail } from "../types/illustrationDetail";

export const useIllustrationById = (
  id: string,
  fallbackData?: IllustrationDetail,
) => {
  return useSWR(
    id ? `/illustrations/${id}` : null,
    null, // Utilise le fetcher global
    { fallbackData },
  );
};
