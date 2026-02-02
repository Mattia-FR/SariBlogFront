import { NavLink } from "react-router-dom";
import type { ImageCardProps } from "../../types/image";

function ImageCard({ image }: ImageCardProps) {
  return (
    <NavLink to={`/gallery/${image.id}`} className="image-card">
      <img
        src={image.imageUrl}
        alt={image.alt_descr || image.title || "Image de galerie"}
        loading="lazy"
      />
      {image.tags && image.tags.length > 0 && (
        <ul className="image-card-tags">
          {image.tags.map((tag) => (
            <li key={tag.id} className="image-card-tag">
              {tag.name}
            </li>
          ))}
        </ul>
      )}
    </NavLink>
  );
}

export default ImageCard;
