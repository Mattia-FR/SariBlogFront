import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../hooks/useAuth";
import type { User } from "../../../../types/users";
import { api } from "../../../../utils/apiClient";
import "./ProfilePage.css";

function ProfilePage() {
  const { setCurrentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await api.get<User>("/admin/users/me");
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil");
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

    const data = {
      username: (formData.get("username") as string)?.trim(),
      email: (formData.get("email") as string)?.trim(),
      firstname: ((formData.get("firstname") as string)?.trim() || null) as
        | string
        | null,
      lastname: ((formData.get("lastname") as string)?.trim() || null) as
        | string
        | null,
      avatar: ((formData.get("avatar") as string)?.trim() || null) as
        | string
        | null,
      bio_short: ((formData.get("bio_short") as string)?.trim() || null) as
        | string
        | null,
      bio: ((formData.get("bio") as string)?.trim() || null) as string | null,
    };

    try {
      const updatedUser = await api.patch<User>("/admin/users/me", data);
      setProfile(updatedUser);
      setCurrentUser(updatedUser);
      setIsEditing(false);
      toast.success("Profil mis à jour");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour du profil");
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
                />
              </label>
            </div>
            <div className="profile-edit-field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  defaultValue={profile.email}
                  required
                />
              </label>
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
              <label>
                Avatar (chemin)
                <input
                  type="text"
                  name="avatar"
                  defaultValue={profile.avatar ?? ""}
                  placeholder="/uploads/images/..."
                />
              </label>
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
              <button type="submit">Enregistrer</button>
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
          </>
        )}
      </div>
    </section>
  );
}

export default ProfilePage;
