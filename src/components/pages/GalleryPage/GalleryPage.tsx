import { useLoaderData } from "react-router-dom";
import ImageCard from "../../molecules/ImageCard";
import type { GalleryLoaderData } from "./galleryTypes";

function GalleryPage() {
  const { images } = useLoaderData<GalleryLoaderData>();

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
