import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useArticleBySlug } from "../../hooks/useArticleBySlug";
import type { ArticleDetailPageData } from "../../types/articleDetail";
import Image from "../atoms/Image";
import TagList from "../molecules/TagList";

import "./ArticleDetail.css";

function ArticleDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Garder : données du loader
  const { article } = useLoaderData() as ArticleDetailPageData;

  // Ajouter : hook SWR avec fallback
  const { data: articleData } = useArticleBySlug(article.slug, article);

  // Utiliser les données SWR ou fallback vers le loader
  const currentArticle = articleData?.data?.article || article;

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
    <article className="article-detail">
      <Image
        src={currentArticle.image}
        alt={currentArticle.title}
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
        tabIndex={0}
      />
      <hr className="article-divider" />
      <h2>{currentArticle.title}</h2>
      <p className="article-date">{currentArticle.created_at}</p>
      <section className="article-content">{currentArticle.content}</section>
      <TagList tags={currentArticle.tags} articleId={currentArticle.id} />

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
                src={`${import.meta.env.VITE_API_URL}/images/${currentArticle.image}`}
                alt={currentArticle.title}
              />
            </section>
          </button>
        </section>
      )}
    </article>
  );
}

export default ArticleDetail;
