import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useScroll } from "../../hooks/useScroll";
import { ThemeToggle } from "../atoms/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScroll();
  const location = useLocation();

  // Détermine si un lien est actif
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Fermer le menu quand on clique sur un lien
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle du menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={`${isScrolled ? "navbar-scrolled" : ""} ${
        isMobileMenuOpen ? "mobile-menu-open" : ""
      }`}
    >
      {/* Bouton burger */}
      <button
        type="button"
        className={`burger-button ${isMobileMenuOpen ? "open" : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Liens de navigation */}
      <section className="nav-links">
        <Link
          to="/"
          className={isActive("/") ? "active" : ""}
          onClick={handleLinkClick}
        >
          <p>Accueil</p>
        </Link>
        <Link
          to="/blog"
          className={isActive("/blog") ? "active" : ""}
          onClick={handleLinkClick}
        >
          <p>Blog</p>
        </Link>
        <Link
          to="/gallery"
          className={isActive("/gallery") ? "active" : ""}
          onClick={handleLinkClick}
        >
          <p>Galerie</p>
        </Link>
        <Link
          to="/about"
          className={isActive("/about") ? "active" : ""}
          onClick={handleLinkClick}
        >
          <p>À propos</p>
        </Link>
        <Link
          to="/contact"
          className={`${isActive("/contact") ? "active" : ""} contact-link`}
          onClick={handleLinkClick}
        >
          <p>Contact</p>
        </Link>
      </section>

      <section className="theme-toggle-container">
        <ThemeToggle />
      </section>
    </nav>
  );
}

export default Navbar;
