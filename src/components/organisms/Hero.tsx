import { Link } from "react-router-dom";
import type { Image } from "../../types/image";

function Hero({ image }: { image: Image | null }) {
  if (!image) {
    return null;
  }
  return (
    <section className="hero-section">
      <div className="hero-media">
        <blockquote className="hero-quote">
          <p>
            « Le dessin, c'est un{" "}
            <span className="hero-quote-accent">outil à raconter</span>. »
          </p>
          <cite>— Christophe Chabouté</cite>
        </blockquote>
        <figure className="hero-figure">
          <img
            className="hero-image"
            src={image.imageUrl}
            alt={image.alt_descr || image.title || "Image du jour"}
          />
        </figure>
      </div>
      <div className="hero-text">
        {image.title && <h3 className="hero-title">{image.title}</h3>}
        {image.description && (
          <p className="hero-description">{image.description}</p>
        )}
        <Link to="/gallery" className="hero-link">
          Voir la galerie
        </Link>
      </div>
    </section>
  );
}

export default Hero;
