import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../utils/apiClient";

interface CommentFormProps {
  articleId: number;
  onSuccess?: () => void;
}

function CommentForm({ articleId, onSuccess }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const text = (formData.get("text") as string)?.trim() ?? "";

    if (!text) return;

    setIsLoading(true);
    try {
      await api.post("/comments", { text, article_id: articleId });
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
