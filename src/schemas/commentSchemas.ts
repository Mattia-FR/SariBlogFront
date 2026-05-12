// Importation de l’objet `z` depuis la bibliothèque Zod.
// `z` donne accès à toutes les fonctions de validation.
import { z } from "zod";

// On exporte un schéma de validation pour la création d'un commentaire.
// `z.object({ ... })` définit un objet avec des règles pour chaque champ.
export const commentCreateSchema = z.object({

  // --- Champ `article_id` ------------------------------------------------
  // Doit être un nombre entier positif.
  article_id: z.coerce   // `z.coerce` convertit automatiquement la valeur
                         // (par ex. si elle arrive sous forme de string "42")
                         // en nombre avant de valider.
    .number()            // Vérifie que la valeur est bien un nombre.
    .int()               // Accepte uniquement les entiers (pas de décimales).
    .positive(           // Le nombre doit être strictement supérieur à 0.
      "L'ID de l'article doit être un entier positif" // Message d’erreur
    ),

  // --- Champ `text` -------------------------------------------------------
  // Le contenu du commentaire.
  text: z.string()       // La valeur doit être une chaîne de caractères.
    .trim()              // Supprime les espaces blancs au début et à la fin
                         // avant toute autre validation.
    .min(                // Longueur minimale après trim
      1,                 // => au moins 1 caractère
      "Le commentaire ne peut pas être vide" // Message d’erreur
    )
    .max(                // Longueur maximale
      2000,              // => ne doit pas dépasser 2000 caractères
      "Le commentaire ne doit pas dépasser 2000 caractères"
    ),

  // --- Champ `firstname` --------------------------------------------------
  // Prénom obligatoire.
  firstname: z.string()  // Chaîne de caractères
    .trim()              // Nettoie les espaces en début/fin
    .min(                // Longueur minimale après trim
      1,                 // => champ obligatoire
      "Le prénom est requis"
    ),

  // --- Champ `lastname` ---------------------------------------------------
  // Nom obligatoire.
  lastname: z.string()   // Chaîne de caractères
    .trim()              // Même traitement que le prénom
    .min(1, "Le nom est requis"),

  // --- Champ `email` ------------------------------------------------------
  // Adresse email valide et obligatoire.
  email: z.string()      // D’abord on vérifie que c’est une chaîne
    .min(                // et qu’elle n’est pas vide
      1,
      "L'email est requis"
    )
    .pipe(               // Ensuite on enchaîne avec un second validateur
      z.email()          // `z.email()` valide le format d'une adresse email
    ),

});