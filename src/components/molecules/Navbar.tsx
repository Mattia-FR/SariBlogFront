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
        <Link to="/gallery" className="">
          Galerie
        </Link>
      </p>
      <p>
        <Link to="/about" className="">
          À propos
        </Link>
      </p>
      <p>
        <Link to="/contact" className="">
          Contact
        </Link>
      </p>
    </nav>
  );
}

export default Navbar;
