import type { MessageCardProps } from "../../types/messages";

function MessageCard({ message }: MessageCardProps) {
  const sender =
    [message.firstname, message.lastname].filter(Boolean).join(" ") ||
    message.username ||
    "Anonyme";

  return (
    <article className="message-card">
      <header className="message-card-meta">
        <ul>
          <li>{sender}</li>
          <li>{message.email}</li>
          <li>
            <time dateTime={message.created_at}>
              {new Date(message.created_at).toLocaleDateString("fr-FR")}
            </time>
          </li>
          <li>{message.status}</li>
        </ul>
      </header>
      <h4 className="message-card-subject">{message.subject}</h4>
      <p className="message-card-text">{message.text}</p>
    </article>
  );
}

export default MessageCard;
