import Navbar from "../molecules/Navbar";
import "./Header.css";
import logo from "../../assets/logo.png";

function Header() {
  return (
    <header>
      <img src={logo} alt="logo" className="header-logo" />
      <div className="header-text">
        <Navbar />
      </div>
    </header>
  );
}

export default Header;
