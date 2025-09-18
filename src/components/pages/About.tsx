import { useLoaderData } from "react-router-dom";
import type { About as AboutType } from "../../types/about";
import Image from "../atoms/Image";

function About() {
  // Récupérer directement les données du loader
  const { about } = useLoaderData() as { about: AboutType | null };

  if (!about) {
    return (
      <section className="about-page">
        <p>Contenu non disponible.</p>
      </section>
    );
  }

  return (
    <section className="about-page">
      <h1>À propos</h1>

      <article className="about-content">
        <section className="about-image">
          <Image src={about.image} alt="Portrait de l'artiste" />
        </section>

        <section className="about-text">
          <div className="about-description">{about.content}</div>

          <p className="about-updated">
            Dernière mise à jour :{" "}
            {new Date(about.updated_at).toLocaleDateString("fr-FR")}
          </p>
        </section>
      </article>
    </section>
  );
}

export default About;
