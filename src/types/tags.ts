/**
 * Tag frontend
 * 
 * Représente un tag tel qu'il est utilisé dans l'application frontend.
 * Les dates sont converties en string (contrairement au backend où elles sont Date).
 */
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

/**
 * Tag avec métadonnées complètes
 * Utilisé pour l'admin ou les cas où on a besoin de created_at
 */
export interface TagWithMetadata extends Tag {
  created_at?: string;
}
