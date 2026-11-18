import { Link } from "react-router-dom";
import type { ArticlesPreviewProps } from "../../types/article";
import ArticleCard from "../molecules/ArticleCard";
import "./ArticlesPreview.css";

function ArticlesPreview({ articles }: ArticlesPreviewProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="articles-preview">
      <div className="articles-preview-header">
        <div className="articles-preview-heading">
          <p className="articles-preview-kicker">Le blog</p>
          <h2 className="articles-preview-title">Derniers articles</h2>
        </div>
        <Link to="/blog" className="articles-preview-link">
          Accéder au blog →
        </Link>
      </div>
      <div className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </div>
    </section>
  );
}

export default ArticlesPreview;
