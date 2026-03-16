import { Link } from "react-router-dom";
import "../ErrorPage/ErrorPage.css";

function NotFoundPage() {
  return (
    <main className="redirection-main">
      <h2>404 - Page non trouvée</h2>
      <p>
        L'adresse demandée n'existe pas sur ce serveur. Par contre, la{" "}
        <Link to="/gallery">galerie</Link> n'attend que toi.
      </p>
    </main>
  );
}

export default NotFoundPage;
