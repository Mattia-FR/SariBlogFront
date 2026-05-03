import type { ChangeEvent } from "react";
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

  function handleTagChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams);
    const v = e.target.value;
    if (v === "") {
      next.delete("tagId");
    } else {
      next.set("tagId", v);
    }
    next.set("page", "1");
    setSearchParams(next);
  }

  return (
    <section className="gallery-grid">
      {category && (
        <Link to="/gallery" className="gallery-grid-title">
          <h1 className="gallery-grid-title">
            <span className="gallery-grid-title-last"> {category.name}</span>
          </h1>
        </Link>
      )}
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={handleTagChange}
      />
      {images.length === 0 ? (
        <p>Aucune image</p>
      ) : (
        <div className="gallery-grid-content">
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
