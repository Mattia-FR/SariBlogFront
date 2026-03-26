import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import type { Message, MessageStatus } from "../../../../types/messages";
import { api } from "../../../../utils/apiClient";
import MessageCard from "../../../molecules/MessageCard";
import NavigationPagination from "../../../molecules/NavigationPagination";
import "./MessagesAdmin.css";

const STATUSES: MessageStatus[] = ["unread", "read", "archived"];

const STATUS_LABELS: Record<MessageStatus, string> = {
  unread: "Non lu",
  read: "Lu",
  archived: "Archivé",
};

type MessagesListResponse = {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
  counts: {
    total: number;
    unread: number;
    read: number;
    archived: number;
  };
};

function MessagesAdmin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status");

  let statusFilter: MessageStatus | null = null;
  if (
    statusParam != null &&
    statusParam !== "" &&
    STATUSES.includes(statusParam as MessageStatus)
  ) {
    statusFilter = statusParam as MessageStatus;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [counts, setCounts] = useState<MessagesListResponse["counts"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      statusParam != null &&
      statusParam !== "" &&
      !STATUSES.includes(statusParam as MessageStatus)
    ) {
      const next = new URLSearchParams(searchParams);
      next.delete("status");
      setSearchParams(next, { replace: true });
    }
  }, [statusParam, searchParams, setSearchParams]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ page: String(page) });
      if (statusFilter != null) {
        q.set("status", statusFilter);
      }
      const data = await api.get<MessagesListResponse>(
        `/admin/messages?${q.toString()}`,
      );
      setMessages(data.messages);
      setTotalPages(Math.ceil(data.total / data.limit));
      setCounts(data.counts);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function handleStatusChange(messageId: number, status: MessageStatus) {
    try {
      await api.patch(`/admin/messages/${messageId}/status`, { status });
      await fetchMessages();
      toast.success("Statut mis à jour");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  }

  async function handleDelete(messageId: number) {
    try {
      await api.delete(`/admin/messages/${messageId}`);
      await fetchMessages();
      toast.success("Message supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  }

  function setStatusTab(nextStatus: MessageStatus | null) {
    const next = new URLSearchParams(searchParams);
    if (nextStatus == null) {
      next.delete("status");
    } else {
      next.set("status", nextStatus);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  if (loading) return <p>Chargement des messages…</p>;
  if (error) return <p>{error}</p>;

  const c = counts ?? {
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
  };

  return (
    <section className="messages-admin">
      <h2 className="messages-admin-title">Gestion des messages</h2>

      <div className="messages-admin-filters">
        <button
          className={statusFilter === null ? "active" : ""}
          onClick={() => setStatusTab(null)}
          type="button"
        >
          Tous ({c.total})
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            className={statusFilter === status ? "active" : ""}
            onClick={() => setStatusTab(status)}
            type="button"
          >
            {STATUS_LABELS[status]} ({c[status]})
          </button>
        ))}
      </div>

      {statusFilter !== null && (
        <div className="messages-admin-filter-active">
          <p>Filtré par : {STATUS_LABELS[statusFilter]}</p>
          <button type="button" onClick={() => setStatusTab(null)}>
            × Effacer le filtre
          </button>
        </div>
      )}

      {messages.length === 0 ? (
        <p>Aucun message</p>
      ) : (
        <section className="messages-admin-grid">
          {messages.map((message) => (
            <div key={message.id} className="messages-admin-item">
              <MessageCard message={message} />
              <div className="messages-admin-item-buttons">
                {message.status !== "unread" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(message.id, "unread")}
                  >
                    Non lu
                  </button>
                )}
                {message.status !== "read" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(message.id, "read")}
                  >
                    Lu
                  </button>
                )}
                {message.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(message.id, "archived")}
                  >
                    Archivé
                  </button>
                )}
                <button type="button" onClick={() => handleDelete(message.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <NavigationPagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/messages"
        searchParams={searchParams}
      />
    </section>
  );
}

export default MessagesAdmin;
