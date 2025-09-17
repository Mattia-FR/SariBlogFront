import type { Illustration } from "./illustration";

export type IllustrationDetail = Illustration & {
  description: string;
  created_at: string;
};

export type IllustrationDetailPageData = {
  illustration: IllustrationDetail;
};
