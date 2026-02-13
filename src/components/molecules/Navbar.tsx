import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      {/* Liens de navigation */}
      <section className="nav-links">
        <NavLink to="/">
          <p>Accueil</p>
        </NavLink>
        <NavLink to="/gallery">
          <p>Galerie</p>
        </NavLink>
        <NavLink to="/blog">
          <p>Blog</p>
        </NavLink>
        <NavLink to="/presentation">
          <p>À propos</p>
        </NavLink>
        <NavLink to="/contact">
          <p>Contact</p>
        </NavLink>
      </section>
    </nav>
  );
}

export default Navbar;
