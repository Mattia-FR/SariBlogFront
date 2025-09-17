import { useId, useState } from "react";

import { api } from "../../lib/api";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

function Contact() {
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: unknown) {
      setStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'envoi";
      setErrorMessage(errorMessage);
    }
  };

  if (status === "success") {
    return (
      <section className="contact-page">
        <h1>Contact</h1>
        <div className="contact-success">
          <h2>Message envoyé !</h2>
          <p>
            Merci pour votre message. Je vous répondrai dans les plus brefs
            délais.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="contact-button"
          >
            Envoyer un autre message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-page">
      <h1>Contact</h1>

      <article className="contact-content">
        <section className="contact-info">
          <h2>Un projet en tête ?</h2>
          <p>
            Discutons de vos idées et créons quelque chose d'unique ensemble.
            N'hésitez pas à me contacter pour toute question ou collaboration.
          </p>
          <p>
            <strong>Email :</strong>{" "}
            {import.meta.env.VITE_CONTACT_EMAIL || "contact@sariblog.com"}
          </p>
        </section>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor={nameId}>Nom *</label>
            <input
              type="text"
              id={nameId}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              minLength={2}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor={emailId}>Email *</label>
            <input
              type="email"
              id={emailId}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={subjectId}>Sujet</label>
            <input
              type="text"
              id={subjectId}
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              maxLength={150}
            />
          </div>

          <div className="form-group">
            <label htmlFor={messageId}>Message *</label>
            <textarea
              id={messageId}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              minLength={10}
              maxLength={1000}
              rows={6}
            />
          </div>

          {status === "error" && (
            <div className="form-error">{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="contact-button"
          >
            {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
          </button>
        </form>
      </article>
    </section>
  );
}

export default Contact;
