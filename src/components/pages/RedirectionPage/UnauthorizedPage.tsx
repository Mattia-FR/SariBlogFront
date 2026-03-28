import { Link } from "react-router-dom";
import "../ErrorPage/ErrorPage.css";

function UnauthorizedPage() {
  return (
    <section className="redirection-main">
      <h2>403 - Accès non autorisé</h2>
      <p>
        Cette zone est réservée aux utilisateurs connectés, et ayant les droits
        d'accès. Mais la <Link to="/gallery">galerie</Link> est totalement
        accessible, elle.
      </p>
    </section>
  );
}

export default UnauthorizedPage;
