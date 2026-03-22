import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import ImageCard from "../../../molecules/ImageCard";
import Modal from "../../../molecules/Modal";
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
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

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
      const [imgRes, tagsRes] = await Promise.all([
        api.get<{ images: Image[]; total: number; limit: number }>(
          `/admin/images?${q.toString()}`,
        ),
        api.get<Tag[]>("/admin/tags/used-on-images"),
      ]);
      setImages(imgRes.images);
      setTotalPages(Math.ceil(imgRes.total / imgRes.limit));
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

  async function handleDelete(image: Image) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;
    try {
      await api.delete(`/admin/images/${image.id}`);
      toast.success("Image supprimée");
      setSelectedImage(null);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  }

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

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="gallery-admin">
      <h2>Gestion des images</h2>
      <Link to="/admin/images/new" className="gallery-admin-new">
        Ajouter une image
      </Link>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      {images.length === 0 ? (
        <p>Aucune image</p>
      ) : (
        <section className="gallery-admin-grid">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={(img) => setSelectedImage(img)}
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

      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <div className="image-detail-modal">
            <img
              src={selectedImage.imageUrl}
              alt={
                selectedImage.alt_descr ||
                selectedImage.title ||
                "Image de galerie"
              }
            />
            {selectedImage.title && (
              <h2 className="image-detail-modal-title">
                {selectedImage.title}
              </h2>
            )}
            {selectedImage.description && (
              <p className="image-detail-modal-description">
                {selectedImage.description}
              </p>
            )}
            <div className="image-detail-modal-link">
              <Link
                to={`/admin/images/edit/${selectedImage.id}`}
                onClick={() => setSelectedImage(null)}
              >
                Modifier
              </Link>
              <button type="button" onClick={() => handleDelete(selectedImage)}>
                Supprimer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

export default ImagesAdmin;
