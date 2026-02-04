import { useLoaderData } from "react-router-dom";
import ImageCard from "../../molecules/ImageCard";
import type { GalleryLoaderData } from "./galleryTypes";
import "./GalleryPage.css";

function GalleryPage() {
  const { images } = useLoaderData<GalleryLoaderData>();

  return (
    <main className="gallery-grid">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </main>
  );
}

export default GalleryPage;
