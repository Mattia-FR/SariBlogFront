import { Link } from "react-router-dom";
import "./Footer.css";
import instagramHover from "../../../public/instagram-hover.png";
import instagramNormal from "../../../public/instagram-normal.png";
import mailHover from "../../../public/mail-hover.png";
import mailNormal from "../../../public/mail-normal.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content-left">
        <p>© 2026 Sari Eliott</p>
        <div className="footer-content-left-icons">
          <a href="https://www.instagram.com/sarieliott/" className="icon-link">
            <img
              src={instagramNormal}
              alt="instagram"
              className="icon-normal"
            />
            <img src={instagramHover} alt="instagram" className="icon-hover" />
          </a>
          <a href="mailto:votre@email.com" className="icon-link">
            <img src={mailNormal} alt="mail" className="icon-normal" />
            <img src={mailHover} alt="mail" className="icon-hover" />
          </a>
        </div>
      </div>
      <div className="footer-content-right">
        <Link to="/">Mentions légales</Link>
        <Link to="/">Politique de confidentialité</Link>
      </div>
    </footer>
  );
}

export default Footer;
