import { Link } from "react-router-dom";
import type { User } from "../../types/users";

function ArtistPreview({ user }: { user: User }) {
  return (
    <section className="artist-preview">
      <h2 className="artist-preview-title">L'artiste</h2>
      <img
        src={user.avatarUrl ?? "/placeholder.png"}
        alt={user.avatarUrl ? user.username : "Avatar par défaut"}
        className="artist-preview-avatar"
      />
      <h3 className="artist-preview-name">
        {user.firstname ?? ""} {user.lastname ?? ""}
      </h3>
      <p className="artist-preview-bio">
        {user.bio_short ?? "Biographie à venir"}
      </p>
      <Link to="/presentation" className="artist-preview-cta">
        Voir la présentation
      </Link>
    </section>
  );
}

export default ArtistPreview;
