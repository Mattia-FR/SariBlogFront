import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { type FormEvent, useId, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/AuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  const emailId = useId();
  const passwordId = useId();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(formData);

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error?.message || "Erreur de connexion");
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-loading">
          <div className="spinner"></div>
          <p>Vérification de l'authentification...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <header>
        <h1>Administration</h1>
        <p>Connectez-vous pour accéder au panneau d'administration</p>
      </header>

      <form onSubmit={handleSubmit} className="admin-login-form">
        {error && <section className="form-error">{error}</section>}

        <fieldset className="form-group">
          <label htmlFor={emailId}>Email</label>
          <section className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              id={emailId}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="votre@email.com"
              disabled={isSubmitting}
            />
          </section>
        </fieldset>

        <fieldset className="form-group">
          <label htmlFor={passwordId}>Mot de passe</label>
          <section className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              id={passwordId}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </section>
        </fieldset>

        <button
          type="submit"
          className="admin-login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <footer className="admin-login-footer">
        <p>Accès réservé aux administrateurs</p>
      </footer>
    </main>
  );
}
