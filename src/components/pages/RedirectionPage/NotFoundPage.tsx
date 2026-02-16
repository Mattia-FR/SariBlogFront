import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main>
      <h2>404 - Page non trouvée</h2>
      <p>
        L'adresse demandée n'existe pas sur ce serveur. Par contre, la{" "}
        <Link to="/gallery">galerie</Link> n'attend que toi.
      </p>
    </main>
  );
}

export default NotFoundPage;
