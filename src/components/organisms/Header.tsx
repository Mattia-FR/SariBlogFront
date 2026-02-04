import Navbar from "../molecules/Navbar";
import Login from "./Login";
import "./Header.css";
import logo from "../../../public/logo.png";

function Header() {
  return (
    <header>
      <img src={logo} alt="logo" className="header-logo" />
      <div className="header-texte">
        <Navbar />
        <Login />
      </div>
    </header>
  );
}

export default Header;
