import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  type ErrorAction,
  getErrorContent,
} from "../pages/ErrorPage/errorContent";
import "../pages/ErrorPage/ErrorPage.css";

interface ErrorViewProps {
  status: number | null;
  onRetry?: () => void;
  // Détail technique, affiché uniquement en DEV
  detail?: string;
  // Hors contexte Router (ErrorBoundary racine), `Link` est inutilisable : on bascule sur <a>.
  inRouter?: boolean;
}

const LINKS: Record<
  Exclude<ErrorAction, "retry">,
  { to: string; label: string }
> = {
  login: { to: "/login", label: "Se connecter" },
  gallery: { to: "/gallery", label: "Voir la galerie" },
  home: { to: "/", label: "Page d'accueil" },
};

function ErrorView({
  status,
  onRetry,
  detail,
  inRouter = true,
}: ErrorViewProps) {
  const { title, message, actions } = getErrorContent(status);

  const items: ReactNode[] = actions.map((action) => {
    if (action === "retry") {
      return onRetry ? (
        <button key={action} type="button" onClick={onRetry}>
          Réessayer
        </button>
      ) : null;
    }
    const { to, label } = LINKS[action];
    return inRouter ? (
      <Link key={action} to={to}>
        {label}
      </Link>
    ) : (
      <a key={action} href={to}>
        {label}
      </a>
    );
  });

  return (
    <section className="redirection-main" role="alert">
      <h2>
        {status !== null && status >= 400 ? `${status} - ${title}` : title}
      </h2>
      <p>{message}</p>
      <div className="redirection-actions">{items}</div>
      {import.meta.env.DEV && detail ? <pre>{detail}</pre> : null}
    </section>
  );
}

export default ErrorView;
