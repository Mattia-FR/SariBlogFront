import { useEffect, useState } from "react";
import type { Message } from "../../../../types/messages";
import { api } from "../../../../utils/apiClient";
import MessageCard from "../../../molecules/MessageCard";

function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.get<Message[]>("/admin/messages");
        setMessages(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Chargement des messages…</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <h2>Gestion des messages</h2>
      <section className="messages-grid">
        {messages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </section>
    </main>
  );
}

export default MessagesAdmin;
