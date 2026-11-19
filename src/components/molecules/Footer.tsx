import { Link } from "react-router-dom";
import "./Footer.css";
import instagramHover from "../../assets/instagram-hover.png";
import instagramNormal from "../../assets/instagram-normal.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content-left">
        <p>© 2026 Sari Eliott</p>
        <div className="footer-content-left-icons">
          <a href="https://www.instagram.com/sarieliott/" className="icon-link">
            <span className="icon-images" aria-hidden="true">
              <img
                src={instagramNormal}
                alt=""
                className="icon-normal"
              />
              <img src={instagramHover} alt="" className="icon-hover" />
            </span>
            <span className="icon-label">Instagram</span>
          </a>
        </div>
      </div>
      <div className="footer-content-right">
        <Link to="/mentions-legales">Mentions légales</Link>
        <Link to="/politique-confidentialite">
          Politique de confidentialité
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
