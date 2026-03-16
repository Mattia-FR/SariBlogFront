import { Link } from "react-router-dom";
import "./ErrorPage.css";

export function ErrorPage() {
  return (
    <main className="redirection-main">
      <h2>Oups !</h2>
      <p>
        Une erreur est survenue. Rechargez la page ou revenez à la{" "}
        <Link to="/">page d'accueil</Link>.
      </p>
    </main>
  );
}
