import type { IllustrationCardProps } from "../../types/illustration";
import "./IllustrationCard.css";

function IllustrationCard({ illustration }: IllustrationCardProps) {
  return (
    <article className="illustration-card">
      <img
        src={`http://localhost:4242/images/${illustration.image}`}
        alt={illustration.alt_text}
      />
      <h5>{illustration.title}</h5>
    </article>
  );
}

export default IllustrationCard;
