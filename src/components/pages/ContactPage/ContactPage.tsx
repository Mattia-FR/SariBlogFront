import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../utils/apiClient";
import "./ContactPage.css";

function ContactPage() {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  // Préremplir les champs si l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // 1. Récupérer l'élément HTML qui a changé
    const changedElement = event.target;
    // 2. Récupérer son nom (attribut "name" dans le HTML)
    const fieldName = changedElement.name;
    // 3. Récupérer sa nouvelle valeur (ce que l'utilisateur a tapé)
    const newValue = changedElement.value;
    // 4. Obtenir la valeur actuelle de formData (avant changement)
    const previousValues = formData;
    // 5. Créer un NOUVEL objet qui copie toutes les anciennes valeurs
    const updatedValues = {
      firstname: previousValues.firstname,
      lastname: previousValues.lastname,
      email: previousValues.email,
      subject: previousValues.subject,
      text: previousValues.text,
    };
    // 6. Modifier SEULEMENT le champ qui a changé
    if (fieldName === "firstname") {
      updatedValues.firstname = newValue;
    } else if (fieldName === "lastname") {
      updatedValues.lastname = newValue;
    } else if (fieldName === "email") {
      updatedValues.email = newValue;
    } else if (fieldName === "subject") {
      updatedValues.subject = newValue;
    } else if (fieldName === "text") {
      updatedValues.text = newValue;
    }
    // 7. Mettre à jour l'état avec le nouvel objet
    setFormData(updatedValues);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // 1. Empêcher le rechargement de la page (comportement par défaut des formulaires)
    event.preventDefault();

    // 2. Indiquer qu'on est en train d'envoyer (pour désactiver le formulaire)
    setIsSubmitting(true);

    // 3. Réinitialiser le message de statut précédent
    setSubmitStatus(null);

    try {
      // 4. Préparer les données à envoyer
      const dataToSend =
        isAuthenticated && user
          ? {
              // Utilisateur connecté : envoyer username et données utilisateur
              username: user.username,
              email: user.email,
              firstname: user.firstname || null,
              lastname: user.lastname || null,
              subject: formData.subject,
              text: formData.text,
            }
          : {
              // Visiteur non connecté : envoyer toutes les données du formulaire
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
              subject: formData.subject,
              text: formData.text,
            };

      // 5. Envoyer les données au backend via le client API
      await api.post("/messages", dataToSend);

      // 6. Succès : afficher un message de confirmation
      setSubmitStatus("success");

      // Réinitialiser le formulaire
      if (isAuthenticated && user) {
        // Utilisateur connecté : garder email, firstname, lastname
        setFormData({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email,
          subject: "",
          text: "",
        });
      } else {
        // Visiteur non connecté : tout réinitialiser
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          subject: "",
          text: "",
        });
      }
    } catch (error) {
      // 7. En cas d'erreur réseau ou autre
      console.error("Erreur lors de l'envoi du message :", error);
      setSubmitStatus("error");
    } finally {
      // 8. Dans tous les cas, réactiver le formulaire
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-main">
      <h1>Formulaire de contact</h1>

      <form onSubmit={handleSubmit} className="contact-form">
        {!isAuthenticated && (
          <>
            <div className="form-group">
              <label htmlFor="firstname">Prénom :</label>
              <input
                className="firstname"
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                required
                maxLength={50}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Nom :</label>
              <input
                className="lastname"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
                maxLength={50}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                className="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="subject">Sujet :</label>
          <input
            className="subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="text">Message :</label>
          <textarea
            className="text"
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>

      {submitStatus === "success" && <p>Message envoyé avec succès !</p>}

      {submitStatus === "error" && (
        <p>Erreur lors de l'envoi. Veuillez réessayer.</p>
      )}
    </main>
  );
}

export default ContactPage;
