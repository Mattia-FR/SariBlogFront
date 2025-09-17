import type { IllustrationDetail } from "./illustrationDetail";
import type { PaginationData } from "./pagination";

export type IllustrationPageData = {
  illustrations: IllustrationDetail[];
  pagination: PaginationData;
};
