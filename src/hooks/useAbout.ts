import useSWR from "swr";
import type { About } from "../types/about";

export const useAbout = (fallbackData?: About) => {
  return useSWR(
    "/about",
    null, // Utilise le fetcher global
    { fallbackData },
  );
};
