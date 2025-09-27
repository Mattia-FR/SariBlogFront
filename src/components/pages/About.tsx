import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useLoaderData } from "react-router-dom";
import type { About as AboutType } from "../../types/about";
import Image from "../atoms/Image";

import "./About.css";

gsap.registerPlugin(useGSAP);

function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { about } = useLoaderData() as { about: AboutType | null };

  useGSAP(
    () => {
      const img = containerRef.current?.querySelector("img");
      if (img) {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });

        tl.to(img, {
          boxShadow: "0 0 30px 10px rgba(255, 234, 229, 0.6)",
          duration: 2,
          ease: "power2.inOut",
        });

        // Animation au hover (plus rapide)
        img.addEventListener("mouseenter", () => {
          tl.timeScale(5); // 2x plus rapide
        });

        img.addEventListener("mouseleave", () => {
          tl.timeScale(1); // Vitesse normale
        });
      }
    },
    { scope: containerRef },
  );

  if (!about) {
    return (
      <section className="about-page">
        <p>Contenu non disponible.</p>
      </section>
    );
  }

  return (
    <section className="about-page">
      <section className="about-image" ref={containerRef}>
        <Image src={about.image} alt="Portrait de l'artiste" />
      </section>

      <section className="about-text">
        <section className="about-description">{about.content}</section>

        <p className="about-updated">
          Dernière mise à jour :{" "}
          {new Date(about.updated_at).toLocaleDateString("fr-FR")}
        </p>
      </section>
    </section>
  );
}

export default About;
