import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import type { Article } from "../../../../types/article";
import { api } from "../../../../utils/apiClient";
import ArticleCard from "../../../molecules/ArticleCard";
import type { Tag } from "../../../../types/tags";
import TagFilter from "../../../molecules/TagFilter";

function ArticlesAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger articles et tags en parallèle
        const [articlesData, tagsData] = await Promise.all([
          api.get<Article[]>("/admin/articles"),
          api.get<Tag[]>("/tags"),
        ]);

        setArticles(articlesData);
        setTags(tagsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement des articles…</p>;
  if (error) return <p>{error}</p>;

  let filteredArticles: Article[];
  if (selectedTagId === "") {
    // Mode "show all" : pas de filtre
    filteredArticles = articles;
  } else {
    // Mode "filter by tag" : on filtre par ID
    filteredArticles = articles.filter((article) => {
      // Si l'article n'a pas de tags, il ne passe pas le filtre
      if (!article.tags) return false;

      // Cherche si au moins un tag correspond
      const hasMatchingTag = article.tags.some(
        (tag) => tag.id === selectedTagId,
      );
      return hasMatchingTag;
    });
  }

  return (
    <main className="articles-preview">
      <h2 className="articles-preview-title">Tous les articles</h2>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={(e) =>
          setSelectedTagId(e.target.value ? Number(e.target.value) : "")
        }
      />
      <NavLink to="/admin/articles/new">Créer un nouvel article.</NavLink>
      <section className="articles-preview-grid">
        {filteredArticles.length === 0 ? (
          <p>Aucun article.</p>
        ) : (
          filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isClickable
              isAdmin
            />
          ))
        )}
      </section>
    </main>
  );
}

export default ArticlesAdmin;
