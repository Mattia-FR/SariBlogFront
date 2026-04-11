import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./ErrorPage.css";

export function ErrorPage() {
  const error = useRouteError();

  let title = "Oups !";
  let message = "Une erreur inattendue est survenue. Rechargez la page ou revenez à la page d'accueil.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page introuvable";
      message = "Cette page n'existe pas ou n'est plus disponible.";
    } else {
      message = "Le serveur a rencontré un problème. Réessayez dans quelques instants.";
    }
  }

  return (
    <section className="redirection-main">
      <h2>{title}</h2>
      <p>
        {message} Revenez à la <Link to="/">page d'accueil</Link>.
      </p>
    </section>
  );
}
