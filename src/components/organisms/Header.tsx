import { NavLink, useLocation } from "react-router-dom";
import Navbar from "../molecules/Navbar";
import "./Header.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";

function Header() {
  const location = useLocation();
  const { user, isInitializing } = useAuth();

  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isAdminAuthorized =
    !!user && (user.role === "admin" || user.role === "editor");

  return (
    <header>
      <NavLink to="/" end aria-label="Aller à l'accueil">
        <img src={logo} alt="logo" className="header-logo" />
      </NavLink>
      <div className="header-text">
        {isAdminAuthorized && !isInitializing && !isAdminRoute && (
          <NavLink to="/admin" end className="header-dashboard-link">
            <p>Tableau de bord</p>
          </NavLink>
        )}
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
