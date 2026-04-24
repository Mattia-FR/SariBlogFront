import { Link } from "react-router-dom";
import type { ArticlesPreviewProps } from "../../types/article";
import ArticleCard from "../molecules/ArticleCard";

function ArticlesPreview({ articles }: ArticlesPreviewProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="articles-preview">
      <h2 className="articles-preview-title">Les derniers articles</h2>
      <div className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </div>
      <Link to="/blog" className="articles-preview-link">
        Accéder au blog
      </Link>
    </section>
  );
}

export default ArticlesPreview;
