import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "Erreur inconnue";

  return (
    <main>
      <h1>Oups !</h1>
      <p>
        Une erreur est survenue. Rechargez la page ou revenez à la page
        d'accueil.
      </p>
      <p>{message}</p>
    </main>
  );
}
