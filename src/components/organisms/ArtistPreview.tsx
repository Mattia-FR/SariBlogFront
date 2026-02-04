import { NavLink } from "react-router-dom";
import type { User } from "../../types/users";

function ArtistPreview({ user }: { user: User }) {
  return (
    <section className="artist-preview">
      <h2 className="artist-preview-title">L'artiste</h2>
      <div className="artist-preview-main">
        <img
          src={user.avatarUrl ?? "/placeholder.png"}
          alt={user.avatarUrl ? user.username : "Avatar par défaut"}
          className="artist-preview-avatar"
        />
        <div className="artist-preview-text">
          <h3 className="artist-preview-name">
            {user.firstname ?? ""} {user.lastname ?? ""}
          </h3>
          <p className="artist-preview-bio">
            {user.bio_short ?? "Biographie à venir"}
          </p>
          <NavLink to="/presentation" className="artist-preview-cta">
            Voir la présentation
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default ArtistPreview;
