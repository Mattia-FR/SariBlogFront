import { NavLink } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content-left">
        <p>© 2026 Sari Eliott</p>
        <a href="https://www.instagram.com/sarieliott/">Mon Instagram</a>
      </div>
      <div className="footer-content-right">
        <NavLink to="/">Mentions légales</NavLink>
        <NavLink to="/">Politique de confidentialité</NavLink>
      </div>
    </footer>
  );
}

export default Footer;
