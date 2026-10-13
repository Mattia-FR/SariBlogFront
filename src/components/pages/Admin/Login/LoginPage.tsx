import { Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import LoginForm from "../../../molecules/LoginForm";
import "./LoginPage.css";

// N'accepte que des chemins internes (évite une redirection ouverte vers un autre site).
function safeRedirect(raw: string | null): string {
  if (raw?.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/admin";
}

function LoginPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Après connexion, `user` est renseigné : on revient à la page demandée avant la redirection.
  if (user) {
    return <Navigate to={safeRedirect(searchParams.get("redirect"))} replace />;
  }

  return (
    <div className="login-page">
      <div className="login-page-card">
        <div className="login-page-header">
          <h1 className="login-page-brand">Mon Application</h1>
          <p className="login-page-subtitle">Connectez-vous à votre compte</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
