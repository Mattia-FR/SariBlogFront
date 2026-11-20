import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Article } from "../../../../types/article";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { isAbortError } from "../../../../utils/apiError";
import { notifyError } from "../../../../utils/notifyError";
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

  const fetchData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ page: String(page) });
      if (tagId != null) {
        q.set("tagId", String(tagId));
      }
      const init = signal ? { signal } : undefined;
      const [listRes, tagsRes] = await Promise.all([
        api.get<ArticlesListResponse>(
          `/admin/articles?${q.toString()}`,
          init,
        ),
        api.get<Tag[]>("/admin/tags/used-on-articles", init),
      ]);
      setArticles(listRes.articles);
      setTotalPages(Math.ceil(listRes.total / listRes.limit));
      setTags(tagsRes);
    } catch (err) {
      if (isAbortError(err)) return;
      setError(notifyError(err, "Erreur lors du chargement"));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, tagId]);

  useEffect(() => {
    const ac = new AbortController();
    void fetchData(ac.signal);
    return () => ac.abort();
  }, [fetchData]);

  const selectedTagId: number | "" = tagId === null ? "" : tagId;

  function handleTagChange(nextTagId: number | "") {
    const next = new URLSearchParams(searchParams);
    if (nextTagId === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", String(nextTagId));
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  if (loading) {
    return (
      <section className="articles-admin">
        <p className="articles-admin-status">Chargement des articles…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="articles-admin">
        <p className="articles-admin-status">{error}</p>
      </section>
    );
  }

  return (
    <section className="articles-admin">
      <header className="articles-admin-header">
        <div className="articles-admin-heading">
          <p className="articles-admin-kicker">Administration</p>
          <h2 className="articles-admin-title">Tous les articles</h2>
        </div>
      </header>
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
          <p className="articles-admin-empty">Aucun article.</p>
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
