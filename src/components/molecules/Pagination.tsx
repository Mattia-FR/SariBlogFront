// Import des icônes de navigation depuis Lucide React
import {
  ChevronLeft, // Flèche gauche simple (page précédente)
  ChevronRight, // Flèche droite simple (page suivante)
  ChevronsLeft, // Double flèche gauche (première page)
  ChevronsRight, // Double flèche droite (dernière page)
} from "lucide-react";

// Import du type TypeScript pour les props du composant
import type { PaginationProps } from "../../types/pagination";

// Import du fichier CSS pour les styles
import "./Pagination.css";

/**
 * Composant de pagination avec navigation complète
 *
 * @param currentPage - Page actuellement sélectionnée (1-indexed)
 * @param totalPages - Nombre total de pages disponibles
 * @param onPageChange - Fonction callback appelée lors du changement de page
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // ===== GESTIONNAIRES D'ÉVÉNEMENTS =====

  /**
   * Navigue vers la page précédente
   * Vérifie qu'on n'est pas déjà sur la première page
   */
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  /**
   * Navigue vers la page suivante
   * Vérifie qu'on n'est pas déjà sur la dernière page
   */
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  /**
   * Navigue vers la première page
   */
  const handleFirst = () => {
    onPageChange(1);
  };

  /**
   * Navigue vers la dernière page
   */
  const handleLast = () => {
    onPageChange(totalPages);
  };

  // ===== LOGIQUE D'AFFICHAGE DES PAGES =====

  /**
   * Calcule quelles pages afficher dans la pagination
   * Implémente une logique intelligente pour limiter le nombre de pages visibles
   *
   * Règles d'affichage :
   * - Si ≤ 7 pages au total : affiche toutes les pages
   * - Si > 7 pages : affiche la page courante ± 2 pages, avec ellipses si nécessaire
   * - Affiche toujours la première et dernière page quand possible
   *
   * @returns Array contenant les numéros de page (number) et les ellipses (string "...")
   */
  const getVisiblePages = () => {
    // Cas simple : peu de pages, on affiche tout
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Cas complexe : beaucoup de pages, on optimise l'affichage
    const pages = [];

    // Calcul de la plage de pages autour de la page courante
    const start = Math.max(1, currentPage - 2); // Au minimum page 1
    const end = Math.min(totalPages, currentPage + 2); // Au maximum dernière page

    // Ajout de la première page et ellipse si nécessaire
    if (start > 1) {
      pages.push(1); // Toujours afficher la page 1
      if (start > 2) pages.push("..."); // Ellipse si il y a un gap
    }

    // Ajout des pages dans la plage courante
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Ajout de la dernière page et ellipse si nécessaire
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("..."); // Ellipse si il y a un gap
      pages.push(totalPages); // Toujours afficher la dernière page
    }

    return pages;
  };

  // ===== RENDU CONDITIONNEL =====

  // Si une seule page ou moins, pas besoin de pagination
  if (totalPages <= 1) return null;

  // Calcul des pages à afficher
  const visiblePages = getVisiblePages();

  // ===== RENDU DU COMPOSANT =====

  return (
    <section className="pagination" aria-label="Navigation des pages">
      {/* Bouton première page */}
      <button
        type="button"
        onClick={handleFirst}
        disabled={currentPage === 1} // Désactivé si on est déjà sur la première page
        className="pagination-btn first-btn"
        aria-label="Première page" // Accessibilité pour les lecteurs d'écran
      >
        <ChevronsLeft />
      </button>

      {/* Bouton page précédente */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1} // Désactivé si on est déjà sur la première page
        className="pagination-btn prev-btn"
        aria-label="Page précédente" // Accessibilité pour les lecteurs d'écran
      >
        <ChevronLeft />
      </button>

      {/* Génération des boutons de page et ellipses */}
      {visiblePages.map((page, index) => {
        // Génération d'une clé unique pour chaque élément
        // Les ellipses ont besoin d'une clé spéciale car elles ne sont pas uniques
        const key =
          typeof page === "number"
            ? `page-${page}` // Clé simple pour les pages
            : `ellipsis-${index}-${currentPage}`; // Clé complexe pour les ellipses

        return (
          <button
            key={key}
            type="button"
            onClick={() => typeof page === "number" && onPageChange(page)} // Click seulement sur les pages
            disabled={typeof page !== "number"} // Ellipses désactivées
            className={`pagination-btn page-btn ${
              page === currentPage ? "active" : "" // Classe active pour la page courante
            } ${typeof page !== "number" ? "ellipsis" : ""}`} // Classe ellipsis pour "..."
            aria-label={
              typeof page === "number" ? `Aller à la page ${page}` : undefined // Pas de label pour ellipses
            }
          >
            {page} {/* Affiche le numéro de page ou "..." */}
          </button>
        );
      })}

      {/* Bouton page suivante */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages} // Désactivé si on est déjà sur la dernière page
        className="pagination-btn next-btn"
        aria-label="Page suivante" // Accessibilité pour les lecteurs d'écran
      >
        <ChevronRight />
      </button>

      {/* Bouton dernière page */}
      <button
        type="button"
        onClick={handleLast}
        disabled={currentPage === totalPages} // Désactivé si on est déjà sur la dernière page
        className="pagination-btn last-btn"
        aria-label="Dernière page" // Accessibilité pour les lecteurs d'écran
      >
        <ChevronsRight />
      </button>
    </section>
  );
}

export default Pagination;
