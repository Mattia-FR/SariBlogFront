import { Link } from "react-router-dom";
import type { HeroProps } from "../../types/hero";

function Hero({ image }: HeroProps) {
  if (!image) {
    return null;
  }
  return (
    <section className="hero">
      <img
        src={image.imageUrl}
        alt={image.alt_descr || image.title || "Image du jour"}
      />
      {image.title && <h2 className="hero-title">{image.title}</h2>}
      {image.description && (
        <p className="hero-description">{image.description}</p>
      )}
      <Link to="/gallery">Voir la galerie</Link>
    </section>
  );
}

export default Hero;
