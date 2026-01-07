// Types pour les articles côté frontend
// Basés sur les types backend mais enrichis pour l'affichage

// Tag (basé sur le type backend TagForList)
export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at?: Date; // Optionnel car non utilisé pour l'affichage
}

// ArticleListItem (basé sur le type backend ArticleListItem)
// Utilisé pour les listes d'articles (sans le content)
export interface ArticleListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published" | "archived";
  user_id: number;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  views: number;
  featured_image_id: number | null;
}

// Article complet (basé sur le type backend Article)
export interface Article extends ArticleListItem {
  content: string; // Le contenu complet de l'article (LONGTEXT)
}

// Article enrichi pour l'affichage dans les listes (homepage, blog)
// Contient les données de base + image URL et tags (enrichis côté frontend)
export interface ArticleForList extends ArticleListItem {
  // URL de l'image featured (enrichie depuis featured_image_id)
  imageUrl?: string;
  // Tags de l'article (enrichis depuis l'API tags)
  tags?: Tag[];
}

// Props pour ArticleCard
export interface ArticleCardProps {
  article: ArticleForList;
  isClickable?: boolean;
}

// Props pour ArticlePage (page détaillée)
export interface ArticlePageProps {
  article: Article & {
    imageUrl?: string;
    tags?: Tag[];
  };
}

// Props pour ArticlesPreview
export interface ArticlesPreviewProps {
  articles: ArticleForList[];
}
