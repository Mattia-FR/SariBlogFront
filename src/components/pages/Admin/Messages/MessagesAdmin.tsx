import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Message } from "../../../../types/messages";
import { api } from "../../../../utils/apiClient";
import MessageCard from "../../../molecules/MessageCard";

function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | "">("");

  useEffect(() => {
    const fetchMessages = async () => {
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
    };

    fetchMessages();
  }, []);

  // 1. Extraire tous les statuts uniques
  const allStatuses = Array.from(new Set(messages.map((msg) => msg.status)));

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
          <MessageCard key={message.id} message={message} />
        ))}
      </section>
    </main>
  );
}

export default MessagesAdmin;
