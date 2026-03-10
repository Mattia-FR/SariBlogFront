import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { commentCreateSchema } from "../../schemas/commentSchemas";
import { api } from "../../utils/apiClient";

interface CommentFormProps {
  articleId: number;
  onSuccess?: () => void;
}

function CommentForm({ articleId, onSuccess }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("text") as string) || "";
    const firstname = (formData.get("firstname") as string) || "";
    const lastname = (formData.get("lastname") as string) || "";
    const email = (formData.get("email") as string) || "";

    // Validation Zod
    const result = commentCreateSchema.safeParse({
      article_id: articleId,
      text,
      firstname,
      lastname,
      email,
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

    setIsLoading(true);
    try {
      await api.post("/comments", result.data);
      form.reset();
      toast.success("Commentaire envoyé");
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'envoi du commentaire.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {formError ? <p>{formError}</p> : null}
      {fieldErrors.firstname && <p>{fieldErrors.firstname}</p>}
      <input
        type="text"
        name="firstname"
        placeholder="Prénom"
        required
        disabled={isLoading}
        aria-label="Prénom"
      />
      {fieldErrors.lastname && <p>{fieldErrors.lastname}</p>}
      <input
        type="text"
        name="lastname"
        placeholder="Nom"
        required
        disabled={isLoading}
        aria-label="Nom"
      />
      {fieldErrors.email && <p>{fieldErrors.email}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isLoading}
        aria-label="Email"
      />
      {fieldErrors.text && <p>{fieldErrors.text}</p>}
      <textarea
        name="text"
        placeholder="Votre commentaire..."
        rows={4}
        required
        disabled={isLoading}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}

export default CommentForm;
