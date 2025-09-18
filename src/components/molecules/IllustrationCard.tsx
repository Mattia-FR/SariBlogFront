import { Link } from "react-router-dom";
import type { IllustrationCardProps } from "../../types/illustration";
import Image from "../atoms/Image";
import "./IllustrationCard.css";

function IllustrationCard({
  illustration,
  isClickable = false,
}: IllustrationCardProps) {
  const cardContent = (
    <article className="illustration-card">
      <Image src={illustration.image} alt={illustration.alt_text} />
      <h5>{illustration.title}</h5>
      {illustration.description && (
        <p className="illustration-description">{illustration.description}</p>
      )}
    </article>
  );

  if (isClickable) {
    return (
      <Link
        to={`/gallery/${illustration.id}`}
        className="illustration-card-link"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default IllustrationCard;
