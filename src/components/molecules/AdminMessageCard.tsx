import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { AdminMessage } from "../../types/admin";

import "./AdminMessageCard.css";

type AdminMessageCardProps = {
  message: AdminMessage;
  onMarkAsRead: (id: number) => void;
  onMarkAsUnread: (id: number) => void;
  onDelete: (id: number) => void;
  onSelect: (message: AdminMessage) => void;
  isSelected?: boolean;
};

function AdminMessageCard({
  message,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onSelect,
  isSelected = false,
}: AdminMessageCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(message);
    }
  };

  return (
    <article
      className={`admin-message-card ${isSelected ? "selected" : ""} ${!message.is_read ? "unread" : ""}`}
      onClick={() => onSelect(message)}
      onKeyDown={handleKeyDown}
      aria-label={`Message de ${message.name}: ${message.subject}`}
    >
      <header className="admin-message-header">
        <section className="admin-message-status">
          {message.is_read ? (
            <MailOpen size={16} className="status-icon read" />
          ) : (
            <Mail size={16} className="status-icon unread" />
          )}
          <span
            className={`status-text ${message.is_read ? "read" : "unread"}`}
          >
            {message.is_read ? "Lu" : "Non lu"}
          </span>
        </section>
        <time className="admin-message-date">
          {formatDate(message.created_at)}
        </time>
      </header>

      <section className="admin-message-content">
        <h3 className="admin-message-subject">{message.subject}</h3>

        <address className="admin-message-sender">
          <strong>{message.name}</strong>
          <span className="sender-email">{message.email}</span>
        </address>

        <p className="admin-message-preview">
          {message.message.length > 150
            ? `${message.message.substring(0, 150)}...`
            : message.message}
        </p>
      </section>

      <section className="admin-message-actions">
        {message.is_read ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsUnread(message.id);
            }}
            className="admin-button secondary"
            title="Marquer comme non lu"
          >
            <Mail size={16} />
            Non lu
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(message.id);
            }}
            className="admin-button primary"
            title="Marquer comme lu"
          >
            <MailOpen size={16} />
            Lu
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(message.id);
          }}
          className="admin-button danger"
          title="Supprimer le message"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </section>
    </article>
  );
}

export default AdminMessageCard;
