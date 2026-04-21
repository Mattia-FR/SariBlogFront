import { useLoaderData } from "react-router-dom";
import type { PresentationLoaderData } from "./presentationTypes";
import "./PresentationPage.css";

function PresentationPage() {
  const { user } = useLoaderData<PresentationLoaderData>();

  return (
    <section className="presentation-page">
      <h1 className="sr-only">Présentation de l'artiste</h1>
      <div className="artist-avatar-wrapper">
        <img
          src={user.avatarUrl ?? "/placeholder.png"}
          alt={user.avatarUrl ? user.username : "Avatar par défaut"}
          className="artist-avatar"
        />
        <h2 className="artist-name">Sari Eliott</h2>
      </div>
      <p className="artist-bio">{user.bio ?? "Biographie à venir"}</p>
    </section>
  );
}

export default PresentationPage;
