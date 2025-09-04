import { Link } from "react-router-dom";
import "./ContactCTA.css";

function ContactCTA() {
  return (
    <section className="contact-cta">
      <h2>Un projet en tête ?</h2>
      <p>Discutons de vos idées et créons quelque chose d'unique ensemble.</p>
      <Link to="/contact" className="cta-button">
        Me contacter
      </Link>
    </section>
  );
}

export default ContactCTA;
