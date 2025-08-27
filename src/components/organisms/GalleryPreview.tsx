import type { GalleryPreviewProps } from "../../types/illustration";
import IllustrationCard from "../molecules/IllustrationCard";
import "./GalleryPreview.css";

function GalleryPreview({
  illustrations,
  title = "Galerie",
}: GalleryPreviewProps) {
  return (
    <section className="gallery-preview">
      <h2>{title}</h2>
      <section className="gallery-illustrations">
        {illustrations.map((illustration) => (
          <IllustrationCard
            key={`gallery-preview-illustration-${illustration.id}`}
            illustration={illustration}
          />
        ))}
      </section>
    </section>
  );
}

export default GalleryPreview;
