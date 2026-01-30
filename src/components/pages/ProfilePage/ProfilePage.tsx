import { useLoaderData } from "react-router-dom";
import type { ProfileLoaderData } from "./profileTypes";

function ProfilePage() {
  const { user } = useLoaderData<ProfileLoaderData>();

  return (
    <section className="profile-page">
      <div className="profile-container">
        <h1>Mon Profil</h1>

        <div className="profile-header">
          <img
            src={user.avatarUrl ?? "/placeholder.png"}
            alt={user.avatarUrl ? `Avatar de ${user.username}` : "Avatar par défaut"}
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{user.username}</h2>
            {user.firstname || user.lastname ? (
              <p className="profile-name">
                {user.firstname} {user.lastname}
              </p>
            ) : null}
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>

        {user.bio && (
          <div className="profile-bio">
            <h3>Biographie</h3>
            <p>{user.bio}</p>
          </div>
        )}

        {user.bio_short && (
          <div className="profile-bio-short">
            <h3>Biographie courte</h3>
            <p>{user.bio_short}</p>
          </div>
        )}

        <div className="profile-meta">
          <p>
            <strong>Membre depuis :</strong>{" "}
            {new Date(user.created_at).toLocaleDateString("fr-FR")}
          </p>
          {user.updated_at && (
            <p>
              <strong>Dernière mise à jour :</strong>{" "}
              {new Date(user.updated_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
