import type { ArticlesPreviewProps } from "../../types/article";
import ArticleCard from "../molecules/ArticleCard";
import "./ArticlesPreview.css";

function ArticlesPreview({ articles }: ArticlesPreviewProps) {
  return (
    <section className="articles-preview">
      <h2>Derniers Articles</h2>
      <section className="articles-grid">
        {articles.map((article) => (
          <ArticleCard
            key={`articles-preview-article-${article.id}`}
            article={article}
          />
        ))}
      </section>
    </section>
  );
}

export default ArticlesPreview;
