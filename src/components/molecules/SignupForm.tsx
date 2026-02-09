import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface SignupFormProps {
  onSuccess?: () => void;
}

function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const username = (formData.get("username") as string) || "";
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";
    const firstname = (formData.get("firstname") as string) || "";
    const lastname = (formData.get("lastname") as string) || "";

    try {
      await signup({
        username,
        email,
        password,
        firstname: firstname ? firstname : null,
        lastname: lastname ? lastname : null,
      });
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur d'inscription";
      setFormError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {formError ? <p>{formError}</p> : null}

      <input
        type="text"
        name="username"
        placeholder="Nom d'utilisateur"
        required
        disabled={isLoading}
      />

      <input
        type="text"
        name="firstname"
        placeholder="Prénom (optionnel)"
        disabled={isLoading}
      />

      <input
        type="text"
        name="lastname"
        placeholder="Nom (optionnel)"
        disabled={isLoading}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />

      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        required
        disabled={isLoading}
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}

export default SignupForm;
