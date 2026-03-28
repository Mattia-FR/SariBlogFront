import { NavLink } from "react-router-dom";
import Navbar from "../molecules/Navbar";
import "./Header.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header>
      <NavLink to="/" end aria-label="Aller à l'accueil">
        <img src={logo} alt="logo" className="header-logo" />
      </NavLink>
      <Navbar />
    </header>
  );
}

export default Header;
