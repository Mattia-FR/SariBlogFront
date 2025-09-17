import { useLoaderData } from "react-router-dom";
import { useIllustrationById } from "../../hooks/useIllustrationById";
import type { IllustrationDetailPageData } from "../../types/illustrationDetail";

function GalleryDetail() {
  // Garder : données du loader
  const { illustration } = useLoaderData() as IllustrationDetailPageData;

  // Ajouter : hook SWR avec fallback
  const { data: illustrationData } = useIllustrationById(
    illustration.id.toString(),
    illustration,
  );

  // Utiliser les données SWR ou fallback vers le loader
  const currentIllustration =
    illustrationData?.data?.illustration || illustration;

  const imageUrl = currentIllustration.image
    ? `${import.meta.env.VITE_API_URL}/images/${currentIllustration.image}`
    : null;

  return (
    <article className="gallery-detail">
      {imageUrl && <img src={imageUrl} alt={currentIllustration.alt_text} />}
      <h2>{currentIllustration.title}</h2>
      <p className="illustration-date">{currentIllustration.created_at}</p>
      {currentIllustration.description && (
        <div className="illustration-description">
          {currentIllustration.description}
        </div>
      )}
    </article>
  );
}

export default GalleryDetail;
