import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <main>
      <h2>403 - Accès non autorisé</h2>
      <p>
        Cette zone est réservée aux utilisateurs connectés, et ayant les droits
        d'accès. Mais la <Link to="/gallery">galerie</Link> est totalement
        accessible, elle.
      </p>
    </main>
  );
}

export default UnauthorizedPage;
