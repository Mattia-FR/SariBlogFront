import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <hr />
      <section className="footer-content">
        <h3>Contact</h3>
        <p>Email: contact@sariblog.com</p>
      </section>

      <section className="footer-bottom">
        <p className="copyright">© 2025 SariBlog. Tous droits réservés.</p>
        <section className="legal-links">
          <Link to="/privacy">Politique de confidentialité</Link>
          <Link to="/terms">Conditions d'utilisation</Link>
          <Link to="/legal">Mentions légales</Link>
          <Link to="/cookies">Gestion des cookies</Link>
        </section>
      </section>
    </footer>
  );
}

export default Footer;
