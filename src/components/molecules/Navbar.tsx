import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminNavLinks from "./AdminNavLinks";
import PublicNavLinks from "./PublicNavLinks";

function Navbar() {
  const location = useLocation();
  const { user, isInitializing } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isAdminAuthorized =
    !!user && (user.role === "admin" || user.role === "editor");

  const navContent =
    isAdminRoute && !isInitializing && isAdminAuthorized ? (
      <AdminNavLinks />
    ) : (
      <PublicNavLinks />
    );

  return (
    <nav>
      {/* Desktop : toujours visible, caché en mobile via CSS */}
      <section className="nav-links">{navContent}</section>

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
          {isAdminRoute && !isInitializing && isAdminAuthorized ? (
            <AdminNavLinks onNavigate={() => setIsOpen(false)} />
          ) : (
            <PublicNavLinks onNavigate={() => setIsOpen(false)} />
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
