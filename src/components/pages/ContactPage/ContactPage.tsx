import { useState } from "react";
import { toast } from "react-toastify";
import { messageVisitorSchema } from "../../../schemas/messageSchemas";
import { api } from "../../../utils/apiClient";
import "./ContactPage.css";

type FormFields = "firstname" | "lastname" | "email" | "subject" | "text";

const CHAR_LIMITS: Partial<Record<FormFields, number>> = {
  firstname: 50,
  lastname: 50,
  email: 100,
  subject: 200,
  text: 5000,
};

function getInlineError(field: FormFields, value: string): string {
  switch (field) {
    case "firstname":
    case "lastname":
      if (value.length > 0 && value.trim().length < 1)
        return "Ce champ est requis.";
      break;
    case "email":
      if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Adresse email invalide.";
      break;
  }
  return "";
}

function ContactPage() {
  const [formData, setFormData] = useState<Record<FormFields, string>>({
    firstname: "",
    lastname: "",
    email: "",
    subject: "",
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Réinitialise touched pour stopper la réévaluation inline pendant la frappe
    setTouched((prev) => ({ ...prev, [name]: false }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    // Mark all fields as touched on submit
    setTouched({
      firstname: true,
      lastname: true,
      email: true,
      subject: true,
      text: true,
    });

    try {
      const result = messageVisitorSchema.safeParse(formData);

      if (!result.success) {
        const errors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          errors[field] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }

      await api.post("/messages", result.data);

      toast.success("Message envoyé avec succès !");

      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        subject: "",
        text: "",
      });
      setTouched({});
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Returns the error message to display for a field.
   * Zod errors (post-submit) take priority over inline errors.
   */
  const getDisplayError = (field: FormFields): string => {
    if (fieldErrors[field]) return fieldErrors[field];
    if (touched[field]) return getInlineError(field, formData[field]);
    return "";
  };

  const renderField = (
    field: FormFields,
    label: string,
    type: "text" | "email" | "textarea" = "text",
  ) => {
    const error = getDisplayError(field);
    const limit = CHAR_LIMITS[field];
    const showCounter =
      (field === "subject" || field === "text") &&
      limit != null &&
      formData[field].length > 0;

    return (
      <div className="form-group">
        <label htmlFor={field}>{label}</label>

        {type === "textarea" ? (
          <textarea
            rows={4}
            id={field}
            className={`text${error ? " field-invalid" : ""}`}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            disabled={isSubmitting}
            aria-describedby={error ? `${field}-error` : undefined}
            maxLength={limit}
            aria-invalid={!!error}
          />
        ) : (
          <input
            id={field}
            className={`${field}${error ? " field-invalid" : ""}`}
            type={type}
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
            maxLength={limit}
            disabled={isSubmitting}
            aria-describedby={error ? `${field}-error` : undefined}
            aria-invalid={!!error}
          />
        )}

        <div className="field-footer">
          {error ? (
            <p id={`${field}-error`} className="field-error" role="alert">
              {error}
            </p>
          ) : (
            <span /> // préserve le layout
          )}
          {showCounter && limit && (
            <span
              className={`char-count${formData[field].length >= limit * 0.9 ? " char-count--warn" : ""}`}
            >
              {formData[field].length}/{limit}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="contact-main">
      <h1 className="sr-only">Me contacter :</h1>
      <div className="contact-text">
        <p>
          Vous avez un projet d'
          <span className="contact-text-emphasis">illustration</span> en tête ou
          une idée de{"\u00A0"}
          <span className="contact-text-emphasis">collaboration</span> ?
        </p>
        <p>
          Je serais ravie d'en discuter avec{" "}
          <span className="contact-text-emphasis">vous</span>.
        </p>
        <p>
          Mes commandes sont actuellement{" "}
          <span className="contact-text-emphasis">ouvertes</span> — écrivez-moi,
          je réponds sous{" "}
          <span className="contact-text-emphasis">quelques jours</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        {renderField("firstname", "Prénom :")}
        {renderField("lastname", "Nom :")}
        {renderField("email", "Email :", "email")}
        {renderField("subject", "Sujet :")}
        {renderField("text", "Message :", "textarea")}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </section>
  );
}

export default ContactPage;
