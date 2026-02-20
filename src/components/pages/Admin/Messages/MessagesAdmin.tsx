import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Message, MessageStatus } from "../../../../types/messages";
import { api } from "../../../../utils/apiClient";
import MessageCard from "../../../molecules/MessageCard";

function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | "">("");

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.get<Message[]>("/admin/messages");
      setMessages(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const allStatuses = Array.from(
    new Set(messages.map((msg) => msg.status)),
  ) as MessageStatus[];

  // 2. Filtrer les messages selon le statut sélectionné
  let filteredMessages: Message[];
  if (selectedStatus === "") {
    filteredMessages = messages;
  } else {
    filteredMessages = messages.filter(
      (message) => message.status === selectedStatus,
    );
  }

  if (loading) return <p>Chargement des messages…</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h2>Gestion des messages</h2>

      {/* 3. Boutons de filtrage par statut */}
      <div>
        <button onClick={() => setSelectedStatus("")} type="button">
          Tous ({messages.length})
        </button>

        {allStatuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            type="button"
          >
            {status} ({messages.filter((m) => m.status === status).length})
          </button>
        ))}
      </div>

      {/* 4. Indicateur du filtre actif */}
      {selectedStatus !== "" && (
        <div>
          <p>Filtré par : {selectedStatus}</p>
          <button type="button" onClick={() => setSelectedStatus("")}>
            × Effacer le filtre
          </button>
        </div>
      )}

      <section className="messages-grid">
        {filteredMessages.map((message) => (
          <div key={message.id}>
            <MessageCard message={message} />
            <div>
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
    </main>
  );
}

export default MessagesAdmin;
