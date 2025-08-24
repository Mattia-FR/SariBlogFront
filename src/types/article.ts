export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  created_at: string;
  tags: string | null;
};

export type ArticleCardProps = {
  article: Article;
};

export type ArticlesPreviewProps = {
  articles: Article[];
  title?: string;
};
