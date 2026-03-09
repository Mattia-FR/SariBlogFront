import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import LoginForm from "../../../molecules/LoginForm";
import "./LoginPage.css";

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-page">
      <div className="login-page-card">
        <div className="login-page-header">
          <h1 className="login-page-brand">Mon Application</h1>
          <p className="login-page-subtitle">Connectez-vous à votre compte</p>
        </div>
        <LoginForm onSuccess={() => toast.success("Connexion réussie !")} />
      </div>
    </div>
  );
}

export default LoginPage;
