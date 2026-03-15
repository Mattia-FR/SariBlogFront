import type { MessageCardProps } from "../../types/messages";

function MessageCard({ message }: MessageCardProps) {
  const sender =
    [message.firstname, message.lastname].filter(Boolean).join(" ") ||
    message.username ||
    "Anonyme";

  return (
    <article className="message-card">
      <div className="message-card-meta">
        <ul>
          <li className="message-card-meta-sender">{sender}</li>
          <li className="message-card-meta-email">{message.email}</li>
          <li className="message-card-meta-date">
            <time dateTime={message.created_at}>
              {new Date(message.created_at).toLocaleDateString("fr-FR")}
            </time>
          </li>
          <li className="message-card-meta-status">{message.status}</li>
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
