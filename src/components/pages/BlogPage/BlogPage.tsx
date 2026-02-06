import { useLoaderData } from "react-router-dom";
import ArticleCard from "../../molecules/ArticleCard";
import type { BlogLoaderData } from "./blogTypes";
import "./BlogPage.css";

function BlogPage() {
  const { articles } = useLoaderData<BlogLoaderData>();

  if (articles.length === 0) {
    return null;
  }

  return (
    <main className="articles-preview">
      <section className="articles-preview-grid">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
    </main>
  );
}

export default BlogPage;
