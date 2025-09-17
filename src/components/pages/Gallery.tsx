import { useLoaderData, useSearchParams } from "react-router-dom";
import { useGallery } from "../../hooks/useGallery";
import type { IllustrationDetail } from "../../types/illustrationDetail";
import type { IllustrationPageData } from "../../types/illustrationPage";
import IllustrationCard from "../molecules/IllustrationCard";
import Pagination from "../molecules/Pagination";

function Gallery() {
  // TOUS les hooks doivent être appelés au niveau supérieur
  const loaderData = useLoaderData() as IllustrationPageData | null;
  const [searchParams, setSearchParams] = useSearchParams();

  // Hook SWR avec fallback
  const limit = Number.parseInt(searchParams.get("limit") || "12", 10);
  const offset = Number.parseInt(searchParams.get("offset") || "0", 10);
  const { data: galleryData } = useGallery(limit, offset, {
    illustrations: loaderData?.illustrations || [],
    pagination: loaderData?.pagination || {
      limit: 12,
      offset: 0,
      totalCount: 0,
      totalPages: 0,
    },
  });

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

  const currentPage =
    Math.floor(
      Number.parseInt(searchParams.get("offset") || "0", 10) /
        Number.parseInt(searchParams.get("limit") || "12", 10),
    ) + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * currentPagination.limit;
    setSearchParams({
      offset: newOffset.toString(),
      limit: currentPagination.limit.toString(),
    });
  };

  return (
    <section className="gallery-page">
      <h1>Galerie</h1>
      <section className="gallery-grid">
        {currentIllustrations.map((illustration: IllustrationDetail) => (
          <IllustrationCard
            key={`gallery-page-${illustration.id}`}
            illustration={illustration}
          />
        ))}
      </section>
      <Pagination
        currentPage={currentPage}
        totalPages={currentPagination.totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default Gallery;
