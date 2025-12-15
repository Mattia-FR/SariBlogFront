import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      {/* Liens de navigation */}
      <section className="nav-links">
        <Link to="/">
          <p>Accueil</p>
        </Link>
        <Link to="/blog">
          <p>Blog</p>
        </Link>
        <Link to="/gallery">
          <p>Galerie</p>
        </Link>
        <Link to="/about">
          <p>À propos</p>
        </Link>
        <Link to="/contact">
          <p>Contact</p>
        </Link>
      </section>
    </nav>
  );
}

export default Navbar;
