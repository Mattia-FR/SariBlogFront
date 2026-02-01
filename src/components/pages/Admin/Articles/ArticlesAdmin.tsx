import { useEffect, useState } from "react";
import type { Article } from "../../../../types/article";
import { api } from "../../../../utils/apiClient";
import ArticleCard from "../../../molecules/ArticleCard";

function ArticlesAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await api.get<Article[]>("/admin/articles");
        setArticles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p className="text-xl">Chargement des articles…</p>;
  if (error) return <p className="text-xl text-red-600">{error}</p>;

  return (
    <main className="articles-preview">
      <h2 className="articles-preview-title">Tous les articles</h2>
      <section className="articles-preview-grid">
        {articles.length === 0 ? (
          <p>Aucun article.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} isClickable />
          ))
        )}
      </section>
    </main>
  );
}

export default ArticlesAdmin;
