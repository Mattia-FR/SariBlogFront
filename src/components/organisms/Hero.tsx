import { Link } from "react-router-dom";
import type { Image } from "../../types/image";

function Hero({ image }: { image: Image | null }) {
  if (!image) {
    return null;
  }
  return (
    <figure className="hero-figure">
      <img
        className="hero-image"
        src={image.imageUrl}
        alt={image.alt_descr || image.title || "Image du jour"}
      />

      <figcaption className="hero-caption">
        <div className="hero-text">
          {image.title && <h3 className="hero-title">{image.title}</h3>}
          {image.description && (
            <p className="hero-description">{image.description}</p>
          )}
        </div>
        <Link to="/gallery" className="hero-link">
          Voir la galerie
        </Link>
      </figcaption>
    </figure>
  );
}

export default Hero;
