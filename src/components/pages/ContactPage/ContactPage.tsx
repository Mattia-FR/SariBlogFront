import { useState } from "react";
import { api } from "../../../utils/api";

function ContactPage() {
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
      // 4. Envoyer les données au backend via le client API
      await api.post("/messages", formData);

      // 5. Succès : afficher un message de confirmation
      setSubmitStatus("success");

      // Réinitialiser le formulaire
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        text: "",
      });
    } catch (error) {
      // 6. En cas d'erreur réseau ou autre
      console.error("Erreur lors de l'envoi du message :", error);
      setSubmitStatus("error");
    } finally {
      // 7. Dans tous les cas, réactiver le formulaire
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Contact</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Prénom:
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
            maxLength={50}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Nom:
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
            maxLength={50}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            maxLength={100}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Sujet:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            maxLength={200}
            disabled={isSubmitting}
          />
        </label>

        <label>
          Message:
          <textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>

      {submitStatus === "success" && (
        <p style={{ color: "green" }}>Message envoyé avec succès !</p>
      )}

      {submitStatus === "error" && (
        <p style={{ color: "red" }}>
          Erreur lors de l'envoi. Veuillez réessayer.
        </p>
      )}
    </div>
  );
}

export default ContactPage;
