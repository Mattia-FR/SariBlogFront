import type { MessageCardProps, MessageStatus } from "../../types/messages";

const STATUS_LABELS: Record<MessageStatus, string> = {
  unread: "Non lu",
  read: "Lu",
  archived: "Archivé",
};

function MessageCard({ message }: MessageCardProps) {
  const sender =
    [message.firstname, message.lastname].filter(Boolean).join(" ") ||
    "Anonyme";

  const statusClass = `message-card--${message.status}`;

  return (
    <article
      className={`message-card ${statusClass}`}
      data-status={message.status}
    >
      <div className="message-card-meta">
        <ul>
          <li className="message-card-meta-sender">{sender}</li>
          <li className="message-card-meta-email">{message.email}</li>
          <li className="message-card-meta-date">
            <time dateTime={message.created_at}>
              {new Date(message.created_at).toLocaleDateString("fr-FR")}
            </time>
          </li>
          <li className="message-card-meta-status">
            {STATUS_LABELS[message.status]}
          </li>
        </ul>
      </div>
      <div className="message-card-message">
        <h4 className="message-card-subject">{message.subject}</h4>
        <p className="message-card-text">{message.text}</p>
      </div>
    </article>
  );
}

export default MessageCard;
