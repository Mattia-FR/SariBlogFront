import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../molecules/LoginForm";
import Modal from "../molecules/Modal";
import SignupForm from "../molecules/SignupForm";
import "./Login.css";
import { NavLink } from "react-router-dom";

function Login() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<"login" | "signup">("login");

  function openLoginModal() {
    setModalContent("login");
    setIsModalOpen(true);
  }

  function openSignupModal() {
    setModalContent("signup");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="login-zone">
      <p>
        Bienvenue,{" "}
        {user ? (
          <NavLink to="/profile" className="login-username">
            {user.username}
          </NavLink>
        ) : (
          "visiteur"
        )}
        .
      </p>

      {user ? (
        <button
          type="button"
          onClick={() =>
            logout().then(() => toast.info("Vous êtes déconnecté"))
          }
        >
          Se déconnecter
        </button>
      ) : (
        <button type="button" onClick={openLoginModal}>
          Se connecter
        </button>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent === "login" ? (
          <div className="logsign-modal-content">
            <h2>Connexion</h2>
            <LoginForm onSuccess={closeModal} />
            <div className="logsign-modal-text">
              <p>Pas encore de compte ?</p>
              <button type="button" onClick={openSignupModal}>
                S'inscrire
              </button>
            </div>
          </div>
        ) : (
          <div className="logsign-modal-content">
            <h2>Créer un compte</h2>
            <SignupForm onSuccess={closeModal} />
            <div className="logsign-modal-text">
              <p>Déjà inscrit ?</p>
              <button type="button" onClick={openLoginModal}>
                Se connecter
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Login;
