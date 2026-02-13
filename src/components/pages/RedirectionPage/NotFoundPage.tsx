import { NavLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <main>
      <h2>404 - Page non trouvée</h2>
      <p>
        L'adresse demandée n'existe pas sur ce serveur. Par contre, la{" "}
        <NavLink to="/gallery">galerie</NavLink> n'attend que toi.
      </p>
    </main>
  );
}

export default NotFoundPage;
