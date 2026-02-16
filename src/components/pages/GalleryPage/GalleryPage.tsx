import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { Image } from "../../../types/image";
import ImageCard from "../../molecules/ImageCard";
import Modal from "../../molecules/Modal";
import TagFilter from "../../molecules/TagFilter";
import type { GalleryLoaderData } from "./galleryTypes";
import "./GalleryPage.css";

function GalleryPage() {
  const { images, tags } = useLoaderData<GalleryLoaderData>();

  const [selectedTagId, setSelectedTagId] = useState<number | "">("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  let filteredImages: Image[];
  if (selectedTagId === "") {
    // Mode "show all" : pas de filtre
    filteredImages = images;
  } else {
    // Mode "filter by tag" : on filtre par ID
    filteredImages = images.filter((image) => {
      // Si l'image n'a pas de tags, elle ne passe pas le filtre
      if (!image.tags) return false;

      // Cherche si au moins un tag correspond
      const hasMatchingTag = image.tags.some((tag) => tag.id === selectedTagId);
      return hasMatchingTag;
    });
  }

  return (
    <main className="gallery-grid">
      <TagFilter
        tags={tags}
        selectedTagId={selectedTagId}
        onTagChange={(e) =>
          setSelectedTagId(e.target.value ? Number(e.target.value) : "")
        }
      />
      {filteredImages.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={(img) => setSelectedImage(img)}
        />
      ))}

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
    </main>
  );
}

export default GalleryPage;
