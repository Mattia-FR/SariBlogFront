import { Link } from "react-router-dom";

export default function ContactCTA() {
  return (
    <section className="contact-cta">
      <h2>Envie de collaborer ?</h2>
      <p>Un projet, une question, ou simplement échanger sur l'art ?</p>
      <Link to="/contact" className="contact-cta-button">
        Me contacter
      </Link>
    </section>
  );
}
