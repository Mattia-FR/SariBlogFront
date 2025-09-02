import { Link } from "react-router-dom";
import type { AboutPreviewProps } from "../../types/about";
import "./AboutPreview.css";

function AboutPreview({ about }: AboutPreviewProps) {
  return (
    <section className="about-preview">
      <section className="about-image">
        <img
          src={`http://localhost:4242/images/${about.image}`}
          alt="Portrait de l'artiste"
        />
      </section>
      <section className="about-text">
        <h2>À propos</h2>
        <p>{about.content}</p>
        <Link to="/about" className="about-link">
          En savoir plus →
        </Link>
      </section>
    </section>
  );
}

export default AboutPreview;
