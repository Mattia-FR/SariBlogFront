import { useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import type { Image } from "../../../types/image";
import ImageCard from "../../molecules/ImageCard";
import Modal from "../../molecules/Modal";
import NavigationPagination from "../../molecules/NavigationPagination";
import TagFilter from "../../molecules/TagFilter";
import type { GalleryLoaderData } from "./galleryTypes";
import "./GalleryPage.css";

function GalleryPage() {
  const { images, tags, category, page, totalPages, tagId } =
    useLoaderData<GalleryLoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const selectedTagId: number | "" = tagId === null ? "" : tagId;

  function handleTagChange(nextTagId: number | "") {
    const next = new URLSearchParams(searchParams);
    if (nextTagId === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", String(nextTagId));
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  return (
    <section className="gallery-page">
      {category && (
        <header className="gallery-page-header">
          <div className="gallery-page-heading">
            <p className="gallery-page-kicker">Galerie</p>
            <h1 className="gallery-page-title">{category.name}</h1>
          </div>
          <Link to="/gallery" className="gallery-page-back">
            Retour aux catégories →
          </Link>
        </header>
      )}
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      {images.length === 0 ? (
        <p className="gallery-page-empty">Aucune image</p>
      ) : (
        <div className="gallery-page-content">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={(img) => setSelectedImage(img)}
            />
          ))}
        </div>
      )}

      {category && (
        <NavigationPagination
          page={page}
          totalPages={totalPages}
          basePath={`/gallery/${category.slug}`}
          searchParams={searchParams}
        />
      )}

      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        ariaLabel="Détail de l'image"
      >
        {selectedImage && (
          <div className="image-detail-modal">
            <img
              src={selectedImage.imageUrl}
              alt={
                selectedImage.alt_descr ||
                selectedImage.title ||
                "Image de galerie"
              }
            />
            {selectedImage.title && (
              <h2 className="image-detail-modal-title">
                {selectedImage.title}
              </h2>
            )}
            {selectedImage.description && (
              <p className="image-detail-modal-description">
                {selectedImage.description}
              </p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}

export default GalleryPage;
