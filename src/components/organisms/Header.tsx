import Navbar from "../molecules/Navbar";
import Login from "./Login";
import "./Header.css";

function Header() {
  return (
    <header>
      <Navbar />
      <Login />
    </header>
  );
}

export default Header;
