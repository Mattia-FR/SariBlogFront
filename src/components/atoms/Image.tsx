import type { ImageProps } from "../../types/image";

function Image({
  src,
  alt,
  className = "",
  fallbackSrc,
  onClick,
  onKeyDown,
  tabIndex,
}: ImageProps) {
  // Construction de l'URL complète si src est fourni
  const imageUrl = src
    ? `${import.meta.env.VITE_API_URL}/images/${src}`
    : fallbackSrc;

  if (!imageUrl) {
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    />
  );
}

export default Image;
