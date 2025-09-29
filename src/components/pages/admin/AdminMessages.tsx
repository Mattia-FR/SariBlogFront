import { useState } from "react";
import { useAdminMessages } from "../../../hooks/useAdminMessages";
import { usePagination } from "../../../hooks/usePagination";
import type { AdminMessage } from "../../../types/admin";
import AdminMessageCard from "../../molecules/AdminMessageCard";
import Pagination from "../../molecules/Pagination";

function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null,
  );

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);

  // Hook SWR
  const {
    messages,
    pagination,
    stats,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteMessage,
    deleteAllRead,
  } = useAdminMessages(limit, offset);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Erreur marquage lu:", error);
    }
  };

  const handleMarkAsUnread = async (id: number) => {
    try {
      await markAsUnread(id);
    } catch (error) {
      console.error("Erreur marquage non lu:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteMessage(id);
      } catch (error) {
        console.error("Erreur suppression message:", error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (confirm("Marquer tous les messages comme lus ?")) {
      try {
        await markAllAsRead();
      } catch (error) {
        console.error("Erreur marquage tous lus:", error);
      }
    }
  };

  const handleDeleteAllRead = async () => {
    if (
      confirm(
        "Supprimer tous les messages lus ? Cette action est irréversible.",
      )
    ) {
      try {
        await deleteAllRead();
      } catch (error) {
        console.error("Erreur suppression tous lus:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <main className="admin-messages-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des messages...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-messages-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des messages.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-messages-page">
      <header className="admin-page-header">
        <h1>Gestion des Messages</h1>
        <section className="admin-messages-stats">
          <article className="stat-item">
            <span className="stat-number">{stats?.total || 0}</span>
            <span className="stat-label">Total</span>
          </article>
          <article className="stat-item unread">
            <span className="stat-number">{stats?.unread || 0}</span>
            <span className="stat-label">Non lus</span>
          </article>
          <article className="stat-item">
            <span className="stat-number">{stats?.read || 0}</span>
            <span className="stat-label">Lus</span>
          </article>
        </section>
      </header>

      <nav className="admin-messages-actions">
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          className="admin-button secondary"
          disabled={!stats?.unread}
        >
          Marquer tout comme lu
        </button>
        <button
          type="button"
          onClick={handleDeleteAllRead}
          className="admin-button danger"
          disabled={!stats?.read}
        >
          Supprimer les lus
        </button>
      </nav>

      <section className="admin-messages-grid">
        {messages.map((message) => (
          <AdminMessageCard
            key={message.id}
            message={message}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onDelete={handleDelete}
            onSelect={setSelectedMessage}
            isSelected={selectedMessage?.id === message.id}
          />
        ))}
      </section>

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => handlePageChange(page, pagination)}
        />
      )}
    </main>
  );
}

export default AdminMessages;
