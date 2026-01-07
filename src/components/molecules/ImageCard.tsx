import { Link } from "react-router-dom";
import type { ImageCardProps } from "../../types/image";

function ImageCard({ image }: ImageCardProps) {
  return (
    <Link to={`/gallery/${image.id}`} className="image-card">
      <img
        src={image.imageUrl}
        alt={image.alt_descr || image.title || "Image de galerie"}
        loading="lazy"
      />
    </Link>
  );
}

export default ImageCard;
