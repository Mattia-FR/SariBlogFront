import type { IllustrationCardProps } from "../../types/illustration";
import "./IllustrationCard.css";

function IllustrationCard({ illustration }: IllustrationCardProps) {
  return (
    <article className="illustration-card">
      <img
        src={`${import.meta.env.VITE_API_URL}/images/${illustration.image}`}
        alt={illustration.alt_text}
      />
      <h5>{illustration.title}</h5>
      {illustration.description && (
        <p className="illustration-description">{illustration.description}</p>
      )}
    </article>
  );
}

export default IllustrationCard;
