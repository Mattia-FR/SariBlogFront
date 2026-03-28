import type { FormEvent } from "react";
import { useId, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../schemas/authSchemas";

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const identifierId = useId();
  const passwordId = useId();
  const identifierErrorId = `${identifierId}-error`;
  const passwordErrorId = `${passwordId}-error`;
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
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    // Validation Zod
    const result = loginSchema.safeParse({ identifier, password });

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await login(result.data.identifier, result.data.password);
      toast.success("Connexion réussie");
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion";
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {formError ? <p>{formError}</p> : null}
      {fieldErrors.identifier ? (
        <p id={identifierErrorId}>{fieldErrors.identifier}</p>
      ) : null}

      <label className="sr-only" htmlFor={identifierId}>
        Email ou nom d'utilisateur
      </label>
      <input
        type="text"
        id={identifierId}
        name="identifier"
        placeholder="Email ou nom d'utilisateur"
        required
        disabled={isLoading}
        aria-invalid={fieldErrors.identifier ? true : undefined}
        aria-describedby={
          fieldErrors.identifier ? identifierErrorId : undefined
        }
        className="login-input-user"
      />

      {fieldErrors.password ? (
        <p id={passwordErrorId}>{fieldErrors.password}</p>
      ) : null}

      <label className="sr-only" htmlFor={passwordId}>
        Mot de passe
      </label>
      <input
        type="password"
        id={passwordId}
        name="password"
        placeholder="Mot de passe"
        required
        disabled={isLoading}
        aria-invalid={fieldErrors.password ? true : undefined}
        aria-describedby={fieldErrors.password ? passwordErrorId : undefined}
        className="login-input-password"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

export default LoginForm;
