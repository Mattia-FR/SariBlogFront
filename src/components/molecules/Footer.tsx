import { useState } from "react";
import "./Footer.css";
import LegalModal from "./LegalModal";

function Footer() {
  const [showLegalModal, setShowLegalModal] = useState(false);

  return (
    <footer className="footer">
      <section className="footer-content">
        <p>
          Email: {import.meta.env.VITE_CONTACT_EMAIL || "contact@sariblog.com"}
        </p>
      </section>

      <section className="footer-bottom">
        <p className="copyright">© 2025 SariBlog. Tous droits réservés.</p>
        <button
          className="legal-button"
          onClick={() => setShowLegalModal(true)}
          type="button"
        >
          Mentions légales
        </button>
      </section>

      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
      />
    </footer>
  );
}

export default Footer;
