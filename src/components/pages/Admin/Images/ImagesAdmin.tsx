import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import ImageCard from "../../../molecules/ImageCard";
import Modal from "../../../molecules/Modal";
import TagFilter from "../../../molecules/TagFilter";
import "./ImagesAdmin.css";

function ImagesAdmin() {
  const [images, setImages] = useState<Image[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [imagesData, tagsData] = await Promise.all([
        api.get<Image[]>("/admin/images"),
        api.get<Tag[]>("/admin/tags"),
      ]);
      setImages(imagesData);
      setTags(tagsData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(image: Image) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;
    try {
      await api.delete(`/admin/images/${image.id}`);
      toast.success("Image supprimée");
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      setSelectedImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  }

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  let filteredImages: Image[];
  if (selectedTagId === "") {
    filteredImages = images;
  } else {
    filteredImages = images.filter((image) => {
      if (!image.tags) return false;
      return image.tags.some((tag) => tag.id === selectedTagId);
    });
  }

  return (
    <main className="gallery-admin">
      <h2>Gestion des images</h2>
      <Link to="/admin/images/new" className="gallery-admin-new">
        Ajouter une image
      </Link>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={(e) =>
          setSelectedTagId(e.target.value ? Number(e.target.value) : "")
        }
      />
      <section className="gallery-admin-grid">
        {filteredImages.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={(img) => setSelectedImage(img)}
          />
        ))}
      </section>

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
