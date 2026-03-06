import type { GalleryHubLoaderData } from "./galleryHubTypes";
import { Link, useLoaderData } from "react-router-dom";

function GalleryHubPage() {
  const { categories } = useLoaderData<GalleryHubLoaderData>();

  return (
    <main className="gallery-hub-page">
      <h1 className="sr-only">Galerie par catégorie</h1>
      <div className="gallery-hub-page__categories">
        {categories.map((category) => (
          <Link key={category.id} to={`/gallery/${category.slug}`}>
            {category.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

export default GalleryHubPage;
