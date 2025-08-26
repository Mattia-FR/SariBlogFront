import type { IllustrationCardProps } from "../../types/illustration";
import "./IllustrationCard.css";

function IllustrationCard({ illustration }: IllustrationCardProps) {
  return (
    <div className="illustration-card">
      <img
        src={`http://localhost:4242/images/${illustration.image}`}
        alt={illustration.alt_text}
      />
      <h3>{illustration.title}</h3>
    </div>
  );
}

export default IllustrationCard;
