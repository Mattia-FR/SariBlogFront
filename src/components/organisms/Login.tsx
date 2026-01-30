import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import LoginForm from "../molecules/LoginForm";
import SignupForm from "../molecules/SignupForm";

function Login() {
  const { user, logout } = useAuth();
  const { openModal, closeModal } = useModal();

  function openSignupModal() {
    openModal({
      title: "Créer un compte",
      content: (
        <div>
          <SignupForm onSuccess={closeModal} />
          <p>
            Déjà inscrit ?{" "}
            <button type="button" onClick={openLoginModal}>
              Se connecter
            </button>
          </p>
        </div>
      ),
    });
  }

  function openLoginModal() {
    openModal({
      title: "Connexion",
      content: (
        <div>
          <LoginForm onSuccess={closeModal} />
          <p>
            Pas encore de compte ?{" "}
            <button type="button" onClick={openSignupModal}>
              S'inscrire
            </button>
          </p>
        </div>
      ),
    });
  }

  return (
    <div className="login-zone">
      <p>Bienvenue, {user ? user.id : "visiteur"}.</p>

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
