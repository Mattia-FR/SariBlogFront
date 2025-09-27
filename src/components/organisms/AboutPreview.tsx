import { Link } from "react-router-dom";
import type { AboutPreviewProps } from "../../types/about";
import Image from "../atoms/Image";
import "./AboutPreview.css";

function AboutPreview({ about }: AboutPreviewProps) {
  if (!about) {
    return (
      <section className="about-preview">
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section className="about-preview">
      <section className="about-image">
        <Image src={about.image} alt="Portrait de l'artiste" />
      </section>
      <section className="about-text">
        <h2>À propos</h2>
        <p>
          {about.content.length > 200
            ? `${about.content.substring(0, 200).trim()}...`
            : about.content}
        </p>
        <Link to="/about" className="about-link">
          En savoir plus
        </Link>
      </section>
    </section>
  );
}

export default AboutPreview;
