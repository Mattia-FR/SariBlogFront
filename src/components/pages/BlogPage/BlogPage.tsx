import { useLoaderData } from "react-router-dom";
import type { Article } from "../../../types/article";
import ArticleCard from "../../molecules/ArticleCard";
import type { BlogLoaderData } from "./blogTypes";
import "./BlogPage.css";
import { useState } from "react";
import NavigationPagination from "../../molecules/NavigationPagination";
import TagFilter from "../../molecules/TagFilter";

function BlogPage() {
  const { articles, tags, page, totalPages } = useLoaderData<BlogLoaderData>();
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

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

  if (articles.length === 0) {
    return (
      <main className="blog-articles-preview">
        <p>Aucun article</p>
      </main>
    );
  }

  return (
    <main className="blog-articles-preview">
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={(e) => {
          setSelectedTagId(e.target.value ? Number(e.target.value) : "");
        }}
      />
      <section className="articles-preview-grid">
        {filteredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} isClickable={true} />
        ))}
      </section>
      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/blog"
      />
    </main>
  );
}

export default BlogPage;
