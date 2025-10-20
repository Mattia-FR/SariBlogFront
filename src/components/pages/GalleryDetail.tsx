import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useIllustrationById } from "../../hooks/useIllustrationById";
import type { IllustrationDetailPageData } from "../../types/illustrationDetail";
import Image from "../atoms/Image";
import TagList from "../molecules/TagList";

import "./GalleryDetail.css";

function GalleryDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Garder : données du loader
  const { illustration } = useLoaderData() as IllustrationDetailPageData;

  // Ajouter : hook SWR avec fallback
  const { data: illustrationData } = useIllustrationById(
    illustration.id.toString(),
    illustration,
  );

  // Utiliser les données SWR ou fallback vers le loader
  const currentIllustration =
    illustrationData?.data?.illustration || illustration;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  };

  return (
    <article className="gallery-detail">
      <Image
        src={currentIllustration.image}
        alt={currentIllustration.alt_text}
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
        tabIndex={0}
      />
      <hr className="gallery-divider" />
      <h2>{currentIllustration.title}</h2>
      <p className="illustration-date">
        {formatDate(currentIllustration.created_at)}
      </p>
      {currentIllustration.description && (
        <section className="illustration-description">
          {currentIllustration.description}
        </section>
      )}
      <TagList
        tags={currentIllustration.tags}
        articleId={currentIllustration.id}
      />

      {/* Modale pour l'image en plein écran */}
      {isModalOpen && (
        <section
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Image en plein écran"
        >
          <button
            type="button"
            className="modal-backdrop"
            onClick={handleModalClose}
            onKeyDown={handleModalKeyDown}
            aria-label="Fermer la modale"
          >
            <section className="modal-content">
              <button
                type="button"
                className="modal-close"
                onClick={handleModalClose}
                aria-label="Fermer l'image"
              >
                ×
              </button>
              <img
                src={`${import.meta.env.VITE_API_URL}/images/${currentIllustration.image}`}
                alt={currentIllustration.alt_text}
              />
            </section>
          </button>
        </section>
      )}
    </article>
  );
}

export default GalleryDetail;
