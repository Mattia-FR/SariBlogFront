import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import { isAbortError } from "../../../../utils/apiError";
import { notifyError } from "../../../../utils/notifyError";
import ImageCard from "../../../molecules/ImageCard";
import NavigationPagination from "../../../molecules/NavigationPagination";
import TagFilter from "../../../molecules/TagFilter";
import "./ImagesAdmin.css";

function ImagesAdmin() {
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

  const [images, setImages] = useState<Image[]>([]);
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
      const [imgRes, tagsRes] = await Promise.all([
        api.get<{ images: Image[]; total: number; limit: number }>(
          `/admin/images?${q.toString()}`,
          init,
        ),
        api.get<Tag[]>("/admin/tags/used-on-images", init),
      ]);
      setImages(imgRes.images);
      setTotalPages(Math.ceil(imgRes.total / imgRes.limit));
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
      <section className="gallery-admin">
        <p className="gallery-admin-status">Chargement…</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="gallery-admin">
        <p className="gallery-admin-status gallery-admin-status--error">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="gallery-admin">
      <header className="gallery-admin-header">
        <div className="gallery-admin-heading">
          <p className="gallery-admin-kicker">Galerie</p>
          <h2 className="gallery-admin-title">Gestion des images</h2>
        </div>
        <Link to="/admin/images/new" className="gallery-admin-new">
          Ajouter une image
        </Link>
      </header>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      {images.length === 0 ? (
        <p className="gallery-admin-empty">Aucune image</p>
      ) : (
        <section className="gallery-admin-grid">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              linkTo={`/admin/images/edit/${image.id}`}
            />
          ))}
        </section>
      )}

      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/images"
        searchParams={searchParams}
      />
    </section>
  );
}

export default ImagesAdmin;
