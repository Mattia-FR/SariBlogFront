import { useLoaderData } from "react-router-dom";
import type { ArticleForList } from "../../types/article";
import ArticlesPreview from "../organisms/ArticlesPreview";

function HomePage() {
  const { articles } = useLoaderData() as { articles: ArticleForList[] };

  return (
    <section className="home-page">
      <ArticlesPreview articles={articles} />
    </section>
  );
}

export default HomePage;
