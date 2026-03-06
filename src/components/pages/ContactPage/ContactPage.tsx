import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../utils/apiClient";
import { messageVisitorSchema, messageConnectedSchema } from "../../../schemas/messageSchemas";
import "./ContactPage.css";

function ContactPage() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    const changedElement = event.target;
    const fieldName = changedElement.name;
    const newValue = changedElement.value;
    const previousValues = formData;
    const updatedValues = {
      firstname: previousValues.firstname,
      lastname: previousValues.lastname,
      email: previousValues.email,
      subject: previousValues.subject,
      text: previousValues.text,
    };
    
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
    
    setFormData(updatedValues);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      // Validation Zod selon le type d'utilisateur
      if (isAuthenticated && user) {
        // Utilisateur connecté : valider avec messageConnectedSchema
        const result = messageConnectedSchema.safeParse({
          subject: formData.subject,
          text: formData.text,
        });

        if (!result.success) {
          const errors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
          }
          setFieldErrors(errors);
          return;
        }

        // Envoyer avec les données utilisateur
        await api.post("/messages", {
          username: user.username,
          email: user.email,
          firstname: user.firstname || null,
          lastname: user.lastname || null,
          subject: result.data.subject,
          text: result.data.text,
        });
      } else {
        // Visiteur : valider avec messageVisitorSchema
        const result = messageVisitorSchema.safeParse({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          subject: formData.subject,
          text: formData.text,
        });

        if (!result.success) {
          const errors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            errors[field] = issue.message;
          }
          setFieldErrors(errors);
          return;
        }

        // Envoyer les données visiteur
        await api.post("/messages", result.data);
      }

      toast.success("Message envoyé avec succès !");

      // Réinitialiser le formulaire
      if (isAuthenticated && user) {
        setFormData({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email,
          subject: "",
          text: "",
        });
      } else {
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          subject: "",
          text: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
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
              {fieldErrors.firstname && <p className="field-error">{fieldErrors.firstname}</p>}
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
              {fieldErrors.lastname && <p className="field-error">{fieldErrors.lastname}</p>}
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
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
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
          {fieldErrors.subject && <p className="field-error">{fieldErrors.subject}</p>}
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
          {fieldErrors.text && <p className="field-error">{fieldErrors.text}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </main>
  );
}

export default ContactPage;