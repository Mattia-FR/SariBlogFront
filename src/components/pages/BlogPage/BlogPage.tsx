import { useLoaderData } from "react-router-dom";
import type { ArticleForList } from "../../../types/article";
import ArticleCard from "../../molecules/ArticleCard";

function BlogPage() {
  const { articles } = useLoaderData() as { articles: ArticleForList[] };

  if (articles.length === 0) {
    return null;
  }

  return (
    <main className="articles-preview">
      <h2 className="articles-preview-title">Tous les articles</h2>
      <section className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
    </main>
  );
}

export default BlogPage;
