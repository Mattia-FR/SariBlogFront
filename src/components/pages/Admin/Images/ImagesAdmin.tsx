import { useEffect, useState } from "react";
import type { Image } from "../../../../types/image";
import { api } from "../../../../utils/apiClient";
import ImageCard from "../../../molecules/ImageCard";

function ImagesAdmin() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await api.get<Image[]>("/admin/images");
        setImages(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) return <p>Chargement des images…</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h2>Gestion des images</h2>
      <section className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </section>
    </main>
  );
}

export default ImagesAdmin;
