import { Link } from "react-router-dom";

export default function ContactCTA() {
  return (
    <section className="contact-cta">
      <div className="contact-cta-inner">
        <h2 className="contact-cta-title">Envie de collaborer ?</h2>
        <div className="contact-cta-text">
          <p>Un projet, une question, ou simplement échanger sur l'art ?</p>
          <Link to="/contact" className="contact-cta-button">
            Me contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
