import { Link } from "react-router-dom";
import "./ContactPreview.css";

export default function ContactCTA() {
  return (
    <section className="contact-cta">
      <div className="contact-cta-inner">
        <div className="contact-cta-left">
          <h2 className="contact-cta-title">Envie de collaborer ?</h2>
          <p className="contact-cta-subtitle">
            Un projet, une question, ou simplement échanger sur l'art ?
          </p>
        </div>
        <div className="contact-cta-right">
          <Link to="/contact" className="contact-cta-button">
            Me contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
