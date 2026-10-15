// Miroir de `Back/src/config/imageConstraints.ts`.

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export type AllowedImageMime = (typeof ALLOWED_IMAGE_MIME)[number];

export const IMAGE_ACCEPT = ALLOWED_IMAGE_MIME.join(",");

const allowedMime = new Set<string>(ALLOWED_IMAGE_MIME);

/** Retourne un message d'erreur, ou `null` si le fichier est acceptable pour l'upload. */
export function getImageFileError(file: File): string | null {
  if (file.size === 0) {
    return "Veuillez sélectionner un fichier à télécharger";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Fichier trop volumineux (max 20 Mo)";
  }
  if (!allowedMime.has(file.type)) {
    return "Format non autorisé (JPEG, PNG, WebP, GIF ou AVIF)";
  }
  return null;
}
