import { useLoaderData } from "react-router-dom";
import type { Image } from "../../../types/image";
import ImageCard from "../../molecules/ImageCard";
import type { GalleryLoaderData } from "./galleryTypes";
import "./GalleryPage.css";
import { useState } from "react";
import TagFilter from "../../molecules/TagFilter";

function GalleryPage() {
  const { images, tags } = useLoaderData<GalleryLoaderData>();

  const [selectedTagId, setSelectedTagId] = useState<number | "">("");

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
        <ImageCard key={image.id} image={image} />
      ))}
    </main>
  );
}

export default GalleryPage;
