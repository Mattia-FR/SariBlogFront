import { Edit, Eye, EyeOff, Trash2 } from "lucide-react";
import type { AdminIllustration } from "../../types/admin";
import Image from "../atoms/Image";
import TagList from "./TagList";

import "./AdminIllustrationCard.css";

type AdminIllustrationCardProps = {
  illustration: AdminIllustration;
  onEdit: (illustration: AdminIllustration) => void;
  onDelete: (id: number) => void;
};

function AdminIllustrationCard({
  illustration,
  onEdit,
  onDelete,
}: AdminIllustrationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="admin-illustration-card">
      <figure className="admin-illustration-image">
        <Image src={illustration.image} alt={illustration.alt_text} />
        <section className="admin-illustration-status">
          {illustration.is_in_gallery ? (
            <Eye size={16} className="status-icon published" />
          ) : (
            <EyeOff size={16} className="status-icon draft" />
          )}
          <span
            className={`status-text ${illustration.is_in_gallery ? "published" : "draft"}`}
          >
            {illustration.is_in_gallery ? "Galerie" : "Privée"}
          </span>
        </section>
      </figure>

      <section className="admin-illustration-content">
        <h3 className="admin-illustration-title">{illustration.title}</h3>

        {illustration.description && (
          <p className="admin-illustration-description">
            {illustration.description}
          </p>
        )}

        <section className="admin-illustration-meta">
          <p className="admin-illustration-date">
            Créé le {formatDate(illustration.created_at)}
          </p>
          {illustration.updated_at !== illustration.created_at && (
            <p className="admin-illustration-date">
              Modifié le {formatDate(illustration.updated_at)}
            </p>
          )}
        </section>

        {illustration.tags && illustration.tags.length > 0 && (
          <section className="admin-illustration-tags">
            <TagList
              tags={illustration.tags.map((tag) => tag.name).join(", ")}
              articleId={illustration.id}
            />
          </section>
        )}

        <section className="admin-illustration-actions">
          <button
            type="button"
            onClick={() => onEdit(illustration)}
            className="admin-button secondary"
            title="Modifier l'illustration"
          >
            <Edit size={16} />
            Modifier
          </button>

          <button
            type="button"
            onClick={() => onDelete(illustration.id)}
            className="admin-button danger"
            title="Supprimer l'illustration"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </section>
      </section>
    </article>
  );
}

export default AdminIllustrationCard;
