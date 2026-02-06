import type { FormEvent } from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setFormError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    try {
      await login({ identifier, password });
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      setFormError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {formError ? <p>{formError}</p> : null}

      <input
        type="text"
        name="identifier"
        placeholder="Email ou nom d'utilisateur"
        required
        disabled={isLoading}
        className="login-input-user"
      />

      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        required
        disabled={isLoading}
        className="login-input-password"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
