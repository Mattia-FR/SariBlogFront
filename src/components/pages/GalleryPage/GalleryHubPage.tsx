import { Link, useLoaderData } from "react-router-dom";
import type { GalleryHubLoaderData } from "./galleryHubTypes";
import "./GalleryHubPage.css";

function GalleryHubPage() {
  const { categories } = useLoaderData<GalleryHubLoaderData>();
  const sortedCategories = [...categories].sort(
    (a, b) => a.display_order - b.display_order,
  );

  return (
    <section className="gallery-hub-page">
      <header className="gallery-hub-header">
        <div className="gallery-hub-heading">
          <p className="gallery-hub-kicker">Galerie</p>
          <h1 className="gallery-hub-title">Parcourir les catégories</h1>
        </div>
      </header>

      {sortedCategories.length === 0 ? (
        <p className="gallery-hub-empty">Aucune catégorie pour le moment.</p>
      ) : (
        <div className="gallery-hub-categories">
          {sortedCategories.map((category) => (
            <Link
              key={category.id}
              to={`/gallery/${category.slug}`}
              className="gallery-hub-card"
            >
              <span className="gallery-hub-card-name">{category.name}</span>
              <span className="gallery-hub-card-cta">Voir la série →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default GalleryHubPage;
