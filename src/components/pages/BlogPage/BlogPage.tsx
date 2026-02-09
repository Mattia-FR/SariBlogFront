import { useLoaderData } from "react-router-dom";
import type { Article } from "../../../types/article";
import ArticleCard from "../../molecules/ArticleCard";
import type { BlogLoaderData } from "./blogTypes";
import "./BlogPage.css";
import { useState } from "react";

function BlogPage() {
  const { articles, tags } = useLoaderData<BlogLoaderData>();

  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

  let filteredArticles: Article[];
  if (selectedTagId === "") {
    // Mode "show all" : pas de filtre
    filteredArticles = articles;
  } else {
    // Mode "filter by tag" : on filtre par ID
    filteredArticles = articles.filter((article) => {
      // Si l'image n'a pas de tags, elle ne passe pas le filtre
      if (!article.tags) return false;

      // Cherche si au moins un tag correspond
      const hasMatchingTag = article.tags.some(
        (tag) => tag.id === selectedTagId,
      );
      return hasMatchingTag;
    });
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <main className="articles-preview">
      <select
        value={selectedTagId}
        onChange={(e) =>
          setSelectedTagId(e.target.value ? Number(e.target.value) : "")
        }
      >
        <option value="">Tous les tags</option>
        {tags.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <section className="articles-preview-grid">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
    </main>
  );
}

export default BlogPage;
