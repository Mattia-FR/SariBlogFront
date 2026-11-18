import { Link } from "react-router-dom";
import type { User } from "../../types/users";
import "./ArtistPreview.css";

function ArtistPreview({ user }: { user: User }) {
  return (
    <section className="artist-preview">
      <div className="artist-preview-left">
        <img
          src={user.avatarUrl ?? "/placeholder.png"}
          alt={user.avatarUrl ? user.username : "Avatar par défaut"}
          className="artist-preview-avatar"
        />
        <h3 className="artist-preview-name">Sari Eliott</h3>
        <p className="artist-preview-tagline">Illustratrice</p>
        <p className="artist-preview-bio">
          {user.bio_short ?? "Biographie à venir"}
        </p>
      </div>
      <div className="artist-preview-right">
        <Link to="/presentation" className="artist-preview-cta">
          En savoir plus
        </Link>
      </div>
    </section>
  );
}

export default ArtistPreview;
