import { NavLink } from "react-router-dom";

export default function ContactCTA() {
  return (
    <section className="contact-cta">
      <div className="contact-cta-inner">
        <h2 className="contact-cta-title">Envie de collaborer ?</h2>
        <div className="contact-cta-texte">
          <p>Un projet, une question, ou simplement échanger sur l'art ?</p>
          <NavLink to="/contact" className="contact-cta-button">
            Me contacter
          </NavLink>
        </div>
      </div>
    </section>
  );
}
