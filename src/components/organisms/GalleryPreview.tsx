import { Link } from "react-router-dom";
import type { GalleryPreviewProps } from "../../types/image";
import ImageCard from "../molecules/ImageCard";
import "./GalleryPreview.css";

function GalleryPreview({ images }: GalleryPreviewProps) {
  if (images.length === 0) {
    return null;
  }

  const previewImages = images.slice(0, 6);

  return (
    <section className="gallery-preview">
      <div className="gallery-preview-header">
        <div className="gallery-preview-heading">
          <p className="gallery-preview-kicker">La galerie</p>
          <h2 className="gallery-preview-title">Quelques œuvres</h2>
        </div>
        <Link to="/gallery" className="gallery-preview-link">
          Voir la galerie →
        </Link>
      </div>
      <div className="gallery-preview-grid">
        {previewImages.map((image, index) => {
          const sizeClass =
            index === 0 || index === 5
              ? "gallery-preview-item--large"
              : "gallery-preview-item--small";

          return (
            <div
              key={image.id}
              className={`gallery-preview-item ${sizeClass}`}
            >
              <ImageCard
                image={image}
                linkTo={
                  image.categorySlug
                    ? `/gallery/${image.categorySlug}`
                    : "/gallery"
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GalleryPreview;
