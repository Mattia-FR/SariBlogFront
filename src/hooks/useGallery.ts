import useSWR from "swr";
import type { IllustrationPageData } from "../types/illustrationPage";

export const useGallery = (
  limit = 12,
  offset = 0,
  fallbackData?: IllustrationPageData,
) => {
  return useSWR(`/illustrations?limit=${limit}&offset=${offset}`, null, {
    fallbackData,
  });
};
