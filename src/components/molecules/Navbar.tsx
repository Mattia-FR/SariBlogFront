import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/gallery", label: "Galerie" },
  { to: "/blog", label: "Blog" },
  { to: "/presentation", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      {/* Desktop : toujours visible, caché en mobile via CSS */}
      <section className="nav-links">
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to}>
            <p>{label}</p>
          </NavLink>
        ))}
      </section>

      {/* Burger : visible uniquement en mobile via CSS */}
      <button
        type="button"
        className="burger-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Menu</span>
        <span className={`menu-icon ${isOpen ? "open" : ""}`} />
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div className="menu-overlay">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setIsOpen(false)}>
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
