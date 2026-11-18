import { Link } from "react-router-dom";
import type { Image } from "../../types/image";
import "./Hero.css";

function Hero({ image }: { image: Image | null }) {
  const hasCaption = Boolean(image?.title || image?.description);

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="hero-copy">
          <p className="hero-overline">Bienvenue sur mon site</p>
          <h1 id="hero-title" className="hero-artist-name">
            <span>Sari</span>
            <span className="hero-artist-surname">Eliott</span>
          </h1>
          <p className="hero-artist-tagline">Illustratrice</p>
        </div>
        <div className="hero-cta-group">
          <Link to="/gallery" className="hero-link">
            Voir la galerie
          </Link>
          <Link to="/blog" className="hero-link hero-link-secondary">
            Lire le blog
          </Link>
        </div>
      </div>

      <div className="hero-visual">
        {image && (
          <img
            className="hero-image"
            src={image.imageUrl}
            alt={image.alt_descr || image.title || "Image du jour"}
            aria-describedby={hasCaption ? "hero-caption" : undefined}
          />
        )}
      </div>

      {image && hasCaption && (
        <p className="hero-caption" id="hero-caption">
          {image.title && (
            <span className="hero-caption-title">{image.title}</span>
          )}
          {image.description && (
            <span className="hero-caption-detail">{image.description}</span>
          )}
        </p>
      )}
    </section>
  );
}

export default Hero;
