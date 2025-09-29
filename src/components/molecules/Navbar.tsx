import { Link } from "react-router-dom";
import { useScroll } from "../../hooks/useScroll";
import { ThemeToggle } from "../atoms/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const isScrolled = useScroll();

  return (
    <nav className={isScrolled ? "navbar-scrolled" : ""}>
      <Link to="/" className="">
        <p>Accueil</p>
      </Link>
      <Link to="/blog" className="">
        <p>Blog</p>
      </Link>
      <Link to="/gallery" className="">
        <p>Galerie</p>
      </Link>
      <Link to="/about" className="">
        <p>À propos</p>
      </Link>
      <Link to="/contact" className="">
        <p>Contact</p>
      </Link>
      <section className="theme-toggle-container">
        <ThemeToggle />
      </section>
    </nav>
  );
}

export default Navbar;
