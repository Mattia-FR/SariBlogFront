import type { ArticlesPreviewProps } from "../../types/article";
import ArticleCard from "../molecules/ArticleCard";

function ArticlesPreview({ articles }: ArticlesPreviewProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="articles-preview">
      <h2 className="articles-preview-title">Derniers Articles</h2>
      <section className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
    </section>
  );
}

export default ArticlesPreview;
