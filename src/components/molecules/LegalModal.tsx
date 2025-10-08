import "./LegalModal.css";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClose();
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    // Empêcher la propagation des événements clavier sur le contenu
    e.stopPropagation();
  };

  return (
    <section
      className="modal-overlay"
      onClick={onClose}
      onKeyDown={handleOverlayKeyDown}
      aria-label="Fermer la modale"
    >
      <article
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleContentKeyDown}
      >
        <button
          className="modal-close"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          type="button"
          aria-label="Fermer"
        >
          ×
        </button>
        <h3>Mentions légales</h3>
        <section>
          <h4>Politique de confidentialité</h4>
          <p>
            Données collectées : nom, email, sujet, message, IP (formulaire
            contact)
          </p>
          <p>Finalité : répondre aux demandes de contact</p>
          <p>Conservation : 3 ans maximum</p>
          <p>Droits : accès, rectification, suppression</p>
        </section>
        <section>
          <h4>Conditions d'utilisation</h4>
          <p>Utilisation du blog d'art</p>
          <p>Propriété intellectuelle des illustrations</p>
        </section>
      </article>
    </section>
  );
}

export default LegalModal;
