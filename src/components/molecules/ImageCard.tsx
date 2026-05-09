import { Link } from "react-router-dom";
import type { ImageCardProps } from "../../types/image";

function ImageCard({ image, linkTo, onClick }: ImageCardProps) {
  const content = (
    <div className="images-card">
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
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="image-card">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        className="image-card"
        onClick={() => onClick(image)}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={`/gallery/${image.id}`} className="image-card">
      {content}
    </Link>
  );
}

export default ImageCard;
