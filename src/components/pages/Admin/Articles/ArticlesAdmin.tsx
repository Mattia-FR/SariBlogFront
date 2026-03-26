import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Article } from "../../../../types/article";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import ArticleCard from "../../../molecules/ArticleCard";
import NavigationPagination from "../../../molecules/NavigationPagination";
import TagFilter from "../../../molecules/TagFilter";
import "./ArticlesAdmin.css";

type ArticlesListResponse = {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
};

function ArticlesAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const tagIdParam = searchParams.get("tagId");
  let tagId: number | null = null;
  if (tagIdParam != null && tagIdParam !== "") {
    const n = Number(tagIdParam);
    if (Number.isInteger(n) && n >= 1) {
      tagId = n;
    }
  }

  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tagIdParam != null && tagIdParam !== "" && tagId === null) {
      const next = new URLSearchParams(searchParams);
      next.delete("tagId");
      setSearchParams(next, { replace: true });
    }
  }, [tagIdParam, tagId, searchParams, setSearchParams]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ page: String(page) });
      if (tagId != null) {
        q.set("tagId", String(tagId));
      }
      const [listRes, tagsRes] = await Promise.all([
        api.get<ArticlesListResponse>(`/admin/articles?${q.toString()}`),
        api.get<Tag[]>("/admin/tags/used-on-articles"),
      ]);
      setArticles(listRes.articles);
      setTotalPages(Math.ceil(listRes.total / listRes.limit));
      setTags(tagsRes);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, tagId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedTagId: number | "" = tagId === null ? "" : tagId;

  function handleTagChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams);
    const v = e.target.value;
    if (v === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", v);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  if (loading) return <p>Chargement des articles…</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="articles-admin">
      <h2 className="articles-admin-title">Tous les articles</h2>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      <Link to="/admin/articles/new" className="articles-admin-new">
        Créer un nouvel article.
      </Link>
      <section className="articles-admin-grid">
        {articles.length === 0 ? (
          <p>Aucun article.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isClickable
              isAdmin
            />
          ))
        )}
      </section>
      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/articles"
        searchParams={searchParams}
      />
    </section>
  );
}

export default ArticlesAdmin;
