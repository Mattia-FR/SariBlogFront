import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import CommentForm from "../../molecules/CommentForm";
import Modal from "../../molecules/Modal";
import type { ArticleLoaderData } from "./articleTypes";
import type { Image } from "../../../types/image";
import "./ArticlePage.css";
import CommentCard from "../../molecules/CommentCard";

function ArticlePage() {
  const data = useLoaderData<ArticleLoaderData>();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const { article, articleImages, comments } = data;

  return (
    <section className="article-detail">
      <h1 className="article-detail-title">{article.title}</h1>

      {article.published_at && (
        <p className="article-detail-date">
          {new Date(article.published_at).toLocaleDateString("fr-FR")}
        </p>
      )}

      {article.tags && article.tags.length > 0 && (
        <ul className="article-detail-tags">
          {article.tags.map((tag) => (
            <li key={tag.id} className="article-detail-tag">
              {tag.name}
            </li>
          ))}
        </ul>
      )}

      <div className="article-detail-images">
        {articleImages.map((image) => (
          <button
            key={image.id}
            type="button"
            className="article-detail-image-btn"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image.imageUrl}
              alt={image.alt_descr || image.title || article.title}
            />
          </button>
        ))}
      </div>

      <Modal isOpen={selectedImage !== null} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="image-detail-modal">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.alt_descr || selectedImage.title || article.title}
            />
            {selectedImage.title && (
              <h2 className="image-detail-modal-title">{selectedImage.title}</h2>
            )}
            {selectedImage.description && (
              <p className="image-detail-modal-description">
                {selectedImage.description}
              </p>
            )}
          </div>
        )}
      </Modal>

      <p className="article-detail-content">{article.content}</p>

      <section aria-label="Commentaires" className="article-detail-comments">
        <h2 className="article-detail-comments-title">Commentaires</h2>
        <button
          className="article-detail-comments-btn"
          type="button"
          onClick={() => setIsCommentModalOpen(true)}
        >
          Laisser un commentaire
        </button>
        <Modal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
        >
          <CommentForm
            articleId={article.id}
            onSuccess={() => setIsCommentModalOpen(false)}
          />
        </Modal>
        {comments.length === 0 ? (
          <p className="article-detail-comments-no">
            Aucun commentaire pour le moment.
          </p>
        ) : (
          <ul className="article-detail-comments-list">
            {comments.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}

export default ArticlePage;
