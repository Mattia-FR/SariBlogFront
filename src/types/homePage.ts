import type { About } from "./about";
import type { Article } from "./article";
import type { Illustration } from "./illustration";

export type HomePageData = {
  articles: Article[];
  illustrations: Illustration[];
  about: About;
};
