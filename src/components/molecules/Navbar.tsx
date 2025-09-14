import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <p>
        <Link to="/" className="">
          Accueil
        </Link>
      </p>
      <p>
        <Link to="/blog" className="">
          Blog
        </Link>
      </p>
      <p>
        <Link to="" className="">
          Galerie
        </Link>
      </p>
      <p>
        <Link to="" className="">
          À propos
        </Link>
      </p>
      <p>
        <Link to="" className="">
          Contact
        </Link>
      </p>
    </nav>
  );
}

export default Navbar;
