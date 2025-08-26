import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <section className="footer-content">
        <section className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/articles">Articles</Link>
            </li>
            <li>
              <Link to="/gallery">Galerie</Link>
            </li>
            <li>
              <Link to="/about">À propos</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </section>

        <section className="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@sariblog.com</p>
        </section>
      </section>

      <section className="footer-bottom">
        <section className="legal-links">
          <Link to="/privacy">Politique de confidentialité</Link>
          <Link to="/terms">Conditions d'utilisation</Link>
          <Link to="/legal">Mentions légales</Link>
          <Link to="/cookies">Gestion des cookies</Link>
        </section>
        <p className="copyright">© 2025 SariBlog. Tous droits réservés.</p>
      </section>
    </footer>
  );
}

export default Footer;
