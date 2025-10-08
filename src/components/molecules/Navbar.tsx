import { Link, useLocation } from "react-router-dom";
import { useScroll } from "../../hooks/useScroll";
import { ThemeToggle } from "../atoms/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const isScrolled = useScroll();
  const location = useLocation();

  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={isScrolled ? "navbar-scrolled" : ""}>
      <Link to="/" className={isActive("/") ? "active" : ""}>
        <p>Accueil</p>
      </Link>
      <Link to="/blog" className={isActive("/blog") ? "active" : ""}>
        <p>Blog</p>
      </Link>
      <Link to="/gallery" className={isActive("/gallery") ? "active" : ""}>
        <p>Galerie</p>
      </Link>
      <Link to="/about" className={isActive("/about") ? "active" : ""}>
        <p>À propos</p>
      </Link>
      <Link
        to="/contact"
        className={`${isActive("/contact") ? "active" : ""} contact-link`}
      >
        <p>Contact</p>
      </Link>
      <section className="theme-toggle-container">
        <ThemeToggle />
      </section>
    </nav>
  );
}

export default Navbar;
