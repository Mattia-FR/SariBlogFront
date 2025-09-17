import type { ImageProps } from "../../types/image";

function Image({ src, alt, className = "", fallbackSrc }: ImageProps) {
  // Construction de l'URL complète si src est fourni
  const imageUrl = src
    ? `${import.meta.env.VITE_API_URL}/images/${src}`
    : fallbackSrc;

  if (!imageUrl) {
    return null;
  }

  return <img src={imageUrl} alt={alt} className={className} />;
}

export default Image;
