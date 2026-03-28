import { Link, useLoaderData } from "react-router-dom";
import type { GalleryHubLoaderData } from "./galleryHubTypes";
import "./GalleryHubPage.css";

function GalleryHubPage() {
  const { categories } = useLoaderData<GalleryHubLoaderData>();

  return (
    <section className="gallery-hub-page">
      <h1 className="sr-only">Galerie par catégorie</h1>
      <div className="gallery-hub-categories">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/gallery/${category.slug}`}
            className="gallery-hub-categorie-title"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default GalleryHubPage;
