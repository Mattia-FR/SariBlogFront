import { useLoaderData } from "react-router-dom";
import ArticleCard from "../../../molecules/ArticleCard";
import type { BlogLoaderData } from "../../BlogPage/blogTypes";

function ArticlesAdmin() {
  const { articles } = useLoaderData<BlogLoaderData>();

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

export default ArticlesAdmin;
