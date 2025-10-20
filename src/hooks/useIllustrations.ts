import useSWR from "swr";
import type { Illustration } from "../types/illustration";

export const useIllustrations = (fallbackData?: Illustration[]) => {
  return useSWR(
    "/illustrations/gallery-preview",
    null, // Utilise le fetcher global
    { fallbackData },
  );
};
