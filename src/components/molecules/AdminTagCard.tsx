import { Edit, Hash, Trash2 } from "lucide-react";
import type { AdminTag } from "../../types/admin";

type AdminTagCardProps = {
  tag: AdminTag;
  onEdit: (tag: AdminTag) => void;
  onDelete: (id: number) => void;
};

function AdminTagCard({ tag, onEdit, onDelete }: AdminTagCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <article className="admin-tag-card">
      <header className="admin-tag-header">
        <figure className="admin-tag-icon">
          <Hash size={20} />
        </figure>
        <section className="admin-tag-info">
          <h3 className="admin-tag-name">{tag.name}</h3>
          <p className="admin-tag-date">Créé le {formatDate(tag.created_at)}</p>
        </section>
      </header>

      <section className="admin-tag-stats">
        {tag.usage_count !== undefined && (
          <article className="usage-count">
            <span className="count-number">{tag.usage_count}</span>
            <span className="count-label">utilisations</span>
          </article>
        )}
      </section>

      <nav className="admin-tag-actions">
        <button
          type="button"
          onClick={() => onEdit(tag)}
          className="admin-button secondary"
          title="Modifier le tag"
        >
          <Edit size={16} />
          Modifier
        </button>

        <button
          type="button"
          onClick={() => onDelete(tag.id)}
          className="admin-button danger"
          title="Supprimer le tag"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </nav>
    </article>
  );
}

export default AdminTagCard;
