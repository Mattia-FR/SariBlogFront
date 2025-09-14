import { MoveLeft, MoveRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryPreviewProps } from "../../types/illustration";
import IllustrationCard from "../molecules/IllustrationCard";
import "./GalleryPreview.css";

function GalleryPreview({
  illustrations,
  title = "Galerie",
}: GalleryPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % illustrations.length);
  }, [illustrations.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + illustrations.length) % illustrations.length,
    );
  }, [illustrations.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <section className="gallery-preview" aria-label="Carrousel de galerie">
      <h2>{title}</h2>

      <section className="carousel-container">
        <button
          type="button"
          className="carousel-btn prev-btn"
          onClick={prevSlide}
          aria-label="Image précédente"
        >
          <MoveLeft />
        </button>

        <section className="carousel-wrapper">
          <section
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {illustrations.map((illustration, index) => (
              <article
                key={`gallery-slide-${illustration.id}-${index}`}
                className="carousel-slide"
              >
                <IllustrationCard illustration={illustration} />
              </article>
            ))}
          </section>
        </section>

        <button
          type="button"
          className="carousel-btn next-btn"
          onClick={nextSlide}
          aria-label="Image suivante"
        >
          <MoveRight />
        </button>
      </section>

      <section className="carousel-indicators">
        {illustrations.map((illustration, index) => (
          <button
            key={`indicator-${illustration.id}-${index}`}
            type="button"
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </section>
    </section>
  );
}

export default GalleryPreview;
