import { useLoaderData } from "react-router-dom";
import { useIllustrationById } from "../../hooks/useIllustrationById";
import type { IllustrationDetailPageData } from "../../types/illustrationDetail";
import Image from "../atoms/Image";

import "./GalleryDetail.css";

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

  return (
    <article className="gallery-detail">
      <h2>{currentIllustration.title}</h2>
      <p className="illustration-date">{currentIllustration.created_at}</p>
      <Image
        src={currentIllustration.image}
        alt={currentIllustration.alt_text}
        className="gallery-image"
      />
      {currentIllustration.description && (
        <div className="illustration-description">
          {currentIllustration.description}
        </div>
      )}
    </article>
  );
}

export default GalleryDetail;
