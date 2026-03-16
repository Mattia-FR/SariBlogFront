import type { CommentCardProps } from "../../types/comment";

function CommentCard({ comment, showStatus = false }: CommentCardProps) {
  const author =
    [comment.firstname, comment.lastname].filter(Boolean).join(" ") ||
    comment.username;

  return (
    <article className="comment-card">
      <div className="comment-card-meta">
        <ul>
          <li className="comment-card-meta-author">{author}</li>
          <li className="comment-card-meta-date">
            <time dateTime={comment.created_at}>
              {new Date(comment.created_at).toLocaleDateString("fr-FR")}
            </time>
          </li>
          {showStatus && comment.status != null ? (
            <li className="comment-card-meta-status">
              Statut : {comment.status}
            </li>
          ) : null}
        </ul>
      </div>
      <p className="comment-card-text">{comment.text}</p>
    </article>
  );
}

export default CommentCard;
