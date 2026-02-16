import { Link } from "react-router-dom";
import type { ImageCardProps } from "../../types/image";

function ImageCard({ image, onClick }: ImageCardProps) {
  const content = (
    <>
      <img
        src={image.imageUrl}
        alt={image.alt_descr || image.title || "Image de galerie"}
        loading="lazy"
        className="image-card-img"
      />

      {image.tags && image.tags.length > 0 && (
        <div className="image-card-tags-container">
          <ul className="image-card-tags">
            {image.tags.map((tag) => (
              <li key={tag.id} className="image-card-tag">
                {tag.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: Modal
      <div
        className="image-card"
        role="button"
        tabIndex={0}
        onClick={() => onClick(image)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(image);
          }
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link to={`/gallery/${image.id}`} className="image-card">
      {content}
    </Link>
  );
}

export default ImageCard;
