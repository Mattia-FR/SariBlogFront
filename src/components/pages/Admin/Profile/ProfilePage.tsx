import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import { updateMePasswordSchema } from "../../../../schemas/userSchemas";
import type { Image } from "../../../../types/image";
import type { User } from "../../../../types/users";
import { api } from "../../../../utils/apiClient";
import {
  ApiError,
  fieldErrorsFromApiDetails,
} from "../../../../utils/apiError";
import { notifyError } from "../../../../utils/notifyError";
import "./ProfilePage.css";

function ProfilePage() {
  const { setCurrentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<
    Record<string, string>
  >({});
  const [profileFieldErrors, setProfileFieldErrors] = useState<
    Record<string, string>
  >({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await api.get<User>("/admin/users/me");
        setProfile(data);
      } catch (err) {
        setError(notifyError(err, "Erreur lors du chargement du profil"));
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    const formData = new FormData(event.currentTarget);

    const username = (formData.get("username") as string)?.trim();
    const data: {
      username: string;
      email: string;
      firstname: string | null;
      lastname: string | null;
      avatar?: string;
      bio_short: string | null;
      bio: string | null;
    } = {
      username,
      email: (formData.get("email") as string)?.trim(),
      firstname: ((formData.get("firstname") as string)?.trim() || null) as
        | string
        | null,
      lastname: ((formData.get("lastname") as string)?.trim() || null) as
        | string
        | null,
      bio_short: ((formData.get("bio_short") as string)?.trim() || null) as
        | string
        | null,
      bio: ((formData.get("bio") as string)?.trim() || null) as string | null,
    };

    setIsSubmitting(true);
    setProfileFieldErrors({});
    try {
      const avatarFile = formData.get("avatarFile");
      if (avatarFile instanceof File && avatarFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("image", avatarFile);
        imageFormData.append("alt_descr", `Avatar de ${username}`);
        try {
          const uploaded = await api.postFormData<Image>(
            "/admin/images",
            imageFormData,
          );
          data.avatar = uploaded.path;
        } catch (err) {
          notifyError(err, "Erreur lors de l'upload de l'avatar");
          return;
        }
      }

      const updatedUser = await api.patch<User>("/admin/users/me", data);
      setProfile(updatedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
      toast.success("Profil mis à jour");
    } catch (err) {
      const message = notifyError(
        err,
        "Erreur lors de la mise à jour du profil",
      );
      if (err instanceof ApiError) {
        if (err.code === "USER_IDENTIFIER_TAKEN") {
          setProfileFieldErrors({ username: message, email: message });
        } else {
          const fromApi = fieldErrorsFromApiDetails(err.details);
          if (fromApi) setProfileFieldErrors(fromApi);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = formData.get("currentPassword") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const result = updateMePasswordSchema.safeParse({
      currentPassword,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const errors = fieldErrorsFromApiDetails(result.error.issues);
      if (errors) setPasswordFieldErrors(errors);
      return;
    }

    const { currentPassword: current, password: nextPassword } = result.data;

    try {
      await api.patch("/admin/users/me/password", {
        currentPassword: current,
        password: nextPassword,
      });
      toast.success("Mot de passe mis à jour. Reconnectez-vous.");
      form.reset();
      await logout();
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        const fromApi = fieldErrorsFromApiDetails(err.details);
        if (fromApi) setPasswordFieldErrors(fromApi);
      }
      notifyError(err, "Erreur lors de la mise à jour du mot de passe");
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error || !profile) return <p>{error ?? "Profil introuvable"}</p>;

  return (
    <section className="profile-page">
      <div className="profile-container">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="profile-edit-form">
            <p className="profile-role">Rôle : {profile.role}</p>
            <div className="profile-edit-field">
              <label>
                Nom d&apos;utilisateur
                <input
                  type="text"
                  name="username"
                  defaultValue={profile.username}
                  required
                  aria-invalid={profileFieldErrors.username ? true : undefined}
                />
              </label>
              {profileFieldErrors.username ? (
                <p className="profile-field-error">
                  {profileFieldErrors.username}
                </p>
              ) : null}
            </div>
            <div className="profile-edit-field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  defaultValue={profile.email}
                  required
                  aria-invalid={profileFieldErrors.email ? true : undefined}
                />
              </label>
              {profileFieldErrors.email ? (
                <p className="profile-field-error">
                  {profileFieldErrors.email}
                </p>
              ) : null}
            </div>
            <div className="profile-edit-field">
              <label>
                Prénom
                <input
                  type="text"
                  name="firstname"
                  defaultValue={profile.firstname ?? ""}
                />
              </label>
            </div>
            <div className="profile-edit-field">
              <label>
                Nom
                <input
                  type="text"
                  name="lastname"
                  defaultValue={profile.lastname ?? ""}
                />
              </label>
            </div>
            <div className="profile-edit-field">
              <img
                src={profile.avatarUrl ?? "/placeholder.png"}
                alt={
                  profile.avatarUrl
                    ? `Avatar de ${profile.username}`
                    : "Avatar par défaut"
                }
                className="profile-avatar"
              />
              <label>
                Nouvel avatar
                <input type="file" name="avatarFile" accept="image/*" />
              </label>
              <p className="profile-field-hint">
                Laisser vide pour conserver l&apos;avatar actuel.
              </p>
            </div>
            <div className="profile-edit-field">
              <label>
                Biographie courte
                <textarea
                  name="bio_short"
                  defaultValue={profile.bio_short ?? ""}
                  rows={3}
                />
              </label>
            </div>
            <div className="profile-edit-field">
              <label>
                Biographie
                <textarea
                  name="bio"
                  defaultValue={profile.bio ?? ""}
                  rows={6}
                />
              </label>
            </div>
            <div className="profile-edit-buttons">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="profile-header">
              <img
                src={profile.avatarUrl ?? "/placeholder.png"}
                alt={
                  profile.avatarUrl
                    ? `Avatar de ${profile.username}`
                    : "Avatar par défaut"
                }
                className="profile-avatar"
              />
              <div className="profile-info">
                <h2>{profile.username}</h2>
                {profile.firstname || profile.lastname ? (
                  <p className="profile-name">
                    {profile.firstname} {profile.lastname}
                  </p>
                ) : null}
                <p className="profile-email">{profile.email}</p>
                <p className="profile-role">{profile.role}</p>
              </div>
            </div>

            {profile.bio && (
              <div className="profile-bio">
                <h3>Biographie</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {profile.bio_short && (
              <div className="profile-bio-short">
                <h3>Biographie courte</h3>
                <p>{profile.bio_short}</p>
              </div>
            )}

            <div className="profile-meta">
              <p>
                Membre depuis :{" "}
                {new Date(profile.created_at).toLocaleDateString("fr-FR")}
              </p>
              {profile.updated_at && (
                <p>
                  Dernière mise à jour :{" "}
                  {new Date(profile.updated_at).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
            <div className="profile-actions">
              <button type="button" onClick={() => setIsEditing(true)}>
                Modifier mon profil
              </button>
            </div>

            <form
              onSubmit={handlePasswordUpdate}
              className="profile-edit-form profile-password-form"
            >
              <h3>Changer le mot de passe</h3>
              <div className="profile-edit-field">
                <label>
                  Mot de passe actuel
                  <span className="profile-password-input">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() =>
                        setShowCurrentPassword((visible) => !visible)
                      }
                      aria-label={
                        showCurrentPassword
                          ? "Masquer le mot de passe actuel"
                          : "Afficher le mot de passe actuel"
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={16} aria-hidden />
                      ) : (
                        <Eye size={16} aria-hidden />
                      )}
                    </button>
                  </span>
                </label>
                {passwordFieldErrors.currentPassword ? (
                  <p className="profile-field-error">
                    {passwordFieldErrors.currentPassword}
                  </p>
                ) : null}
              </div>
              <div className="profile-edit-field">
                <label>
                  Nouveau mot de passe
                  <span className="profile-password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={
                        showPassword
                          ? "Masquer le nouveau mot de passe"
                          : "Afficher le nouveau mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} aria-hidden />
                      ) : (
                        <Eye size={16} aria-hidden />
                      )}
                    </button>
                  </span>
                </label>
                {passwordFieldErrors.password ? (
                  <p className="profile-field-error">
                    {passwordFieldErrors.password}
                  </p>
                ) : null}
              </div>
              <div className="profile-edit-field">
                <label>
                  Confirmer le nouveau mot de passe
                  <span className="profile-password-input">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      className="profile-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Masquer la confirmation du mot de passe"
                          : "Afficher la confirmation du mot de passe"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} aria-hidden />
                      ) : (
                        <Eye size={16} aria-hidden />
                      )}
                    </button>
                  </span>
                </label>
                {passwordFieldErrors.confirmPassword ? (
                  <p className="profile-field-error">
                    {passwordFieldErrors.confirmPassword}
                  </p>
                ) : null}
              </div>
              <div className="profile-edit-buttons">
                <button type="submit">Mettre à jour le mot de passe</button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
