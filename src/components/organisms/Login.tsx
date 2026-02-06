import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import LoginForm from "../molecules/LoginForm";
import SignupForm from "../molecules/SignupForm";
import "./Login.css";
import "./Login.css";

function Login() {
  const { user, logout } = useAuth();
  const { openModal, closeModal } = useModal();

  function openSignupModal() {
    openModal({
      title: "Créer un compte",
      content: (
        <div className="logsign-modal-content">
          <SignupForm onSuccess={closeModal} />
          <div className="logsign-modal-text">
            <p>Déjà inscrit ?</p>
            <button type="button" onClick={openLoginModal}>
              Se connecter
            </button>
          </div>
        </div>
      ),
    });
  }

  function openLoginModal() {
    openModal({
      title: "Connexion",
      content: (
        <div className="logsign-modal-content">
          <LoginForm onSuccess={closeModal} />
          <div className="logsign-modal-text">
            <p>Pas encore de compte ?</p>
            <button type="button" onClick={openSignupModal}>
              S'inscrire
            </button>
          </div>
        </div>
      ),
    });
  }

  return (
    <div className="login-zone">
      <p>Bienvenue, {user ? user.username : "visiteur"}.</p>

      {user ? (
        <button type="button" onClick={() => void logout()}>
          Se déconnecter
        </button>
      ) : (
        <button type="button" onClick={openLoginModal}>
          Se connecter
        </button>
      )}
    </div>
  );
}

export default Login;
