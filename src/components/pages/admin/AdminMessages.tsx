import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  useAdminMessageStats,
  useAdminMessages,
} from "../../../hooks/useAdminMessages"; // ✅ Ajouter useAdminMessageStats
import { usePagination } from "../../../hooks/usePagination";
import type { AdminMessage, AdminMessagesPageData } from "../../../types/admin";
import AdminMessageCard from "../../molecules/AdminMessageCard";
import Pagination from "../../molecules/Pagination";

import "./AdminMessages.css";

function AdminMessages() {
  console.info("🔍 [COMPONENT MESSAGES] Rendu du composant");

  // ✅ Ajouter useLoaderData
  const loaderData = useLoaderData() as AdminMessagesPageData;
  const {
    messages: loaderMessages,
    pagination: loaderPagination,
    stats: loaderStats,
  } = loaderData;

  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(
    null,
  );

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination(12);
  console.info("🔍 [COMPONENT MESSAGES] Pagination:", {
    limit,
    offset,
    currentPage,
  });

  // ✅ Hook SWR avec fallback
  const {
    messages: swrMessages,
    pagination: swrPagination,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteMessage,
    deleteAllRead,
  } = useAdminMessages(limit, offset);

  // ✅ Hook séparé pour les stats
  const { stats: swrStats } = useAdminMessageStats();

  // ✅ Utiliser les données SWR ou fallback vers le loader
  const messages = swrMessages.length > 0 ? swrMessages : loaderMessages;
  const pagination = swrPagination || loaderPagination;
  const stats = swrStats || loaderStats;

  console.info("🔍 [COMPONENT MESSAGES] Messages:", messages);
  console.info("🔍 [COMPONENT MESSAGES] Pagination:", pagination);
  console.info("🔍 [COMPONENT MESSAGES] Stats:", stats);
  console.info("🔍 [COMPONENT MESSAGES] IsLoading:", isLoading);
  console.info("🔍 [COMPONENT MESSAGES] Error:", error);

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

  // ✅ Afficher le loading seulement si on n'a pas de données du loader
  if (isLoading && loaderMessages.length === 0) {
    console.info("🔍 [COMPONENT MESSAGES] Affichage du loading");
    return (
      <main className="admin-messages-page">
        <section className="admin-loading">
          <div className="spinner"></div>
          <p>Chargement des messages...</p>
        </section>
      </main>
    );
  }

  // ✅ Afficher l'erreur seulement si on n'a pas de données du loader
  if (error && loaderMessages.length === 0) {
    console.info("🔍 [COMPONENT MESSAGES] Affichage de l'erreur:", error);
    return (
      <main className="admin-messages-page">
        <section className="admin-error">
          <p>Erreur lors du chargement des messages.</p>
        </section>
      </main>
    );
  }

  console.info(
    "🔍 [COMPONENT MESSAGES] Rendu de la page avec",
    messages.length,
    "messages",
  );

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

      <section className="admin-messages-actions">
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
      </section>

      {/* Pagination déplacée en haut */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => handlePageChange(page, pagination)}
        />
      )}

      <section className="admin-messages-grid">
        {messages.length === 0 ? (
          <p>Aucun message trouvé</p>
        ) : (
          messages.map((message) => (
            <AdminMessageCard
              key={message.id}
              message={message}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDelete}
              onSelect={setSelectedMessage}
              isSelected={selectedMessage?.id === message.id}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default AdminMessages;
