import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import CommentForm from "../../molecules/CommentForm";
import Modal from "../../molecules/Modal";
import type { ArticleLoaderData } from "./articleTypes";
import "./ArticlePage.css";
import CommentCard from "../../molecules/CommentCard";

function ArticlePage() {
  const data = useLoaderData<ArticleLoaderData>();
  const { user } = useAuth();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const { article, articleImages, comments } = data;

  return (
    <main className="article-detail">
      <h1 className="article-title">{article.title}</h1>

      {article.published_at && (
        <p className="article-date">
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

      <div className="article-images">
        {articleImages.map((image) => (
          <img
            key={image.id}
            src={image.imageUrl}
            alt={image.alt_descr || image.title || article.title}
          />
        ))}
      </div>

      <p>{article.content}</p>

      <section aria-label="Commentaires">
        <h2>Commentaires</h2>
        {user ? (
          <>
            <button type="button" onClick={() => setIsCommentModalOpen(true)}>
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
          </>
        ) : (
          <p>Connectez-vous pour laisser un commentaire.</p>
        )}
        {comments.length === 0 ? (
          <p>Aucun commentaire pour le moment.</p>
        ) : (
          <ul>
            {comments.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default ArticlePage;
