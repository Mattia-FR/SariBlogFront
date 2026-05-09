import { useLoaderData } from "react-router-dom";
import type { PresentationLoaderData } from "./presentationTypes";
import "./PresentationPage.css";

function PresentationPage() {
  const { user } = useLoaderData<PresentationLoaderData>();

  return (
    <section className="presentation-page">
      <h1 className="sr-only">Présentation de l'artiste</h1>
      <div className="artist-avatar-column">
        <div className="artist-avatar-frame">
          <img
            src={user.avatarUrl ?? "/placeholder.png"}
            alt={user.avatarUrl ? user.username : "Avatar par défaut"}
            className="artist-avatar"
          />
        </div>
      </div>
      <div className="artist-content">
        <h2 className="artist-name">
          <span className="artist-name-line">Sari</span>
          <span className="artist-surname-line">Eliott</span>
        </h2>
        <p className="artist-bio">{user.bio ?? "Biographie à venir"}</p>
      </div>
    </section>
  );
}

export default PresentationPage;
