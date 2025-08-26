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
      <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
        {illustrations.map((illustration) => (
          <IllustrationCard
            key={`gallery-preview-illustration-${illustration.id}`}
            illustration={illustration}
          />
        ))}
      </div>
    </section>
  );
}

export default GalleryPreview;
