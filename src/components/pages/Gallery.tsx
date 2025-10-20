import { useLoaderData } from "react-router-dom";
import { useGallery } from "../../hooks/useGallery";
import { usePagination } from "../../hooks/usePagination";
import type { IllustrationDetail } from "../../types/illustrationDetail";
import type { IllustrationPageData } from "../../types/illustrationPage";
import IllustrationCard from "../molecules/IllustrationCard";
import Pagination from "../molecules/Pagination";

import "./Gallery.css";

function Gallery() {
  // TOUS les hooks doivent être appelés au niveau supérieur
  const loaderData = useLoaderData() as IllustrationPageData | null;

  // Hook de pagination
  const { limit, offset, currentPage, handlePageChange } = usePagination();

  // Hook SWR avec fallback
  const { data: galleryData } = useGallery(limit, offset, {
    illustrations: loaderData?.illustrations || [],
    pagination: loaderData?.pagination || {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
  });

  // Pattern exact du diagramme pour 12 images
  const getCardSizeClass = (index: number): string => {
    const layout = [
      "size-1x1",
      "size-2x1",
      "size-1x1", // A(1×1), B(2×1), C(1×1)
      "size-1x1",
      "size-1x1",
      "size-1x1", // D(1×1), E(1×1), F(1×1)
      "size-1x2",
      "size-2x1",
      "size-1x1", // G(1×2), H(2×1), I(1×1)
      "size-1x1",
      "size-1x1",
      "size-1x1", // J(1×1), K(1×1), L(1×1)
    ];
    return layout[index % layout.length];
  };

  // Si pas de données, afficher un message d'erreur
  if (!loaderData) {
    return (
      <section className="gallery-page">
        <h1>Galerie</h1>
        <p>Erreur lors du chargement de la galerie.</p>
      </section>
    );
  }

  const { illustrations, pagination } = loaderData;

  // Utiliser les données SWR ou fallback vers le loader
  const currentIllustrations = galleryData?.illustrations || illustrations;
  const currentPagination = galleryData?.pagination || pagination;

  return (
    <section className="gallery-page">
      <section className="gallery-grid">
        {currentIllustrations.map(
          (illustration: IllustrationDetail, index: number) => (
            <IllustrationCard
              key={`gallery-page-${illustration.id}`}
              illustration={illustration}
              isClickable={true}
              showText={false}
              className={getCardSizeClass(index)}
              dataTitle={illustration.title}
            />
          ),
        )}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={currentPagination.totalPages}
        onPageChange={(page) => handlePageChange(page, currentPagination)}
      />
    </section>
  );
}

export default Gallery;
