import { Link } from "react-router-dom";
import type { IllustrationCardProps } from "../../types/illustration";
import Image from "../atoms/Image";

function IllustrationCard({
  illustration,
  isClickable = false,
  showText = true,
  className = "",
  dataTitle = "",
}: IllustrationCardProps) {
  const cardContent = (
    <article className="illustration-card" data-title={dataTitle}>
      <Image src={illustration.image} alt={illustration.alt_text} />
      {showText && (
        <>
          <h5>{illustration.title}</h5>
          {illustration.description && (
            <p className="illustration-description">
              {illustration.description}
            </p>
          )}
        </>
      )}
    </article>
  );

  if (isClickable) {
    return (
      <Link
        to={`/gallery/${illustration.id}`}
        className={`illustration-card-link ${className}`.trim()} // ← Appliquer la classe ici !
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default IllustrationCard;
