// Types pour l'image du jour côté frontend
// Basés sur les types backend

import type { ImageWithUrl } from "./image";

export interface HeroProps {
  image: ImageWithUrl | null;
}
