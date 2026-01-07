import { useLoaderData } from "react-router-dom";
import type { Image } from "../../types/image";
import ImageCard from "../molecules/ImageCard";

function GalleryPage() {
  const { images } = useLoaderData() as { images: Image[] };

  return (
    <div>
      <h1>GalleryPage</h1>
      <section className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </section>
    </div>
  );
}

export default GalleryPage;
