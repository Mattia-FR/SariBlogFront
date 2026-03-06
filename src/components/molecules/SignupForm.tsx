import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { registerSchema } from "../../schemas/authSchemas";

interface SignupFormProps {
  onSuccess?: () => void;
}

function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup, isLoading } = useAuth();
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
    const username = (formData.get("username") as string) || "";
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";
    const firstname = (formData.get("firstname") as string) || "";
    const lastname = (formData.get("lastname") as string) || "";

    // Validation Zod
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      firstname: firstname || undefined,
      lastname: lastname || undefined,
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

    try {
      await signup(
        result.data.username,
        result.data.email,
        result.data.password,
        result.data.firstname || null,
        result.data.lastname || null,
      );
      toast.success("Compte créé avec succès");
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur d'inscription";
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      {formError ? <p>{formError}</p> : null}
      {fieldErrors.username && <p>{fieldErrors.username}</p>}
      
      <input
        type="text"
        name="username"
        placeholder="Nom d'utilisateur"
        required
        disabled={isLoading}
      />
      
      {fieldErrors.firstname && <p>{fieldErrors.firstname}</p>}
      
      <input
        type="text"
        name="firstname"
        placeholder="Prénom (optionnel)"
        disabled={isLoading}
      />
      
      {fieldErrors.lastname && <p>{fieldErrors.lastname}</p>}
      
      <input
        type="text"
        name="lastname"
        placeholder="Nom (optionnel)"
        disabled={isLoading}
      />
      
      {fieldErrors.email && <p>{fieldErrors.email}</p>}
      
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        disabled={isLoading}
      />
      
      {fieldErrors.password && <p>{fieldErrors.password}</p>}
      
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