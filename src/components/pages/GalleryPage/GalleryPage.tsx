import { useLoaderData } from "react-router-dom";
import ImageCard from "../../molecules/ImageCard";
import type { GalleryLoaderData } from "./galleryTypes";
import "./GalleryPage.css";

function GalleryPage() {
  const { images } = useLoaderData<GalleryLoaderData>();

  return (
    <main>
      <section className="gallery-grid">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </section>
    </main>
  );
}

export default GalleryPage;
