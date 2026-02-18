import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Image } from "../../../../types/image";
import type { Tag } from "../../../../types/tags";
import { api } from "../../../../utils/apiClient";
import ImageCard from "../../../molecules/ImageCard";
import TagFilter from "../../../molecules/TagFilter";

function ImagesAdmin() {
  const [images, setImages] = useState<Image[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger images et tags en parallèle
        const [imagesData, tagsData] = await Promise.all([
          api.get<Image[]>("/admin/images"),
          api.get<Tag[]>("/tags"),
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
    };

    fetchData();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  let filteredImages: Image[];
  if (selectedTagId === "") {
    // Mode "show all" : pas de filtre
    filteredImages = images;
  } else {
    // Mode "filter by tag" : on filtre par ID
    filteredImages = images.filter((image) => {
      // Si l'image n'a pas de tags, elle ne passe pas le filtre
      if (!image.tags) return false;

      // Cherche si au moins un tag correspond
      const hasMatchingTag = image.tags.some((tag) => tag.id === selectedTagId);
      return hasMatchingTag;
    });
  }

  return (
    <main>
      <h2>Gestion des images</h2>
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={(e) =>
          setSelectedTagId(e.target.value ? Number(e.target.value) : "")
        }
      />
      <section className="gallery-grid">
        {filteredImages.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </section>
    </main>
  );
}

export default ImagesAdmin;
