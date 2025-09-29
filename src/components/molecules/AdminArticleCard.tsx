import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import type { AdminArticle } from "../../types/admin";
import Image from "../atoms/Image";
import TagList from "./TagList";

import "./AdminArticleCard.css";

type AdminArticleCardProps = {
  article: AdminArticle;
  onEdit: (article: AdminArticle) => void;
  onDelete: (id: number) => void;
};

function AdminArticleCard({
  article,
  onEdit,
  onDelete,
}: AdminArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="admin-article-card">
      <figure className="admin-article-image">
        <Image src={article.image} alt={article.title} />
        <section className="admin-article-status">
          {article.status === "published" ? (
            <Eye size={16} className="status-icon published" />
          ) : (
            <EyeOff size={16} className="status-icon draft" />
          )}
          <span className={`status-text ${article.status}`}>
            {article.status === "published" ? "Publié" : "Brouillon"}
          </span>
        </section>
      </figure>

      <section className="admin-article-content">
        <h3 className="admin-article-title">{article.title}</h3>

        {article.excerpt && (
          <p className="admin-article-excerpt">{article.excerpt}</p>
        )}

        <section className="admin-article-meta">
          <p className="admin-article-date">
            Créé le {formatDate(article.created_at)}
          </p>
          {article.updated_at !== article.created_at && (
            <p className="admin-article-date">
              Modifié le {formatDate(article.updated_at)}
            </p>
          )}
        </section>

        {article.tags && article.tags.length > 0 && (
          <section className="admin-article-tags">
            <TagList
              tags={article.tags.map((tag) => tag.name).join(", ")}
              articleId={article.id}
            />
          </section>
        )}

        <section className="admin-article-actions">
          <button
            type="button"
            onClick={() => onEdit(article)}
            className="admin-button secondary"
            title="Modifier l'article"
          >
            <Edit size={16} />
            Modifier
          </button>

          <button
            type="button"
            onClick={() => onDelete(article.id)}
            className="admin-button danger"
            title="Supprimer l'article"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </section>
      </section>
    </article>
  );
}

export default AdminArticleCard;
