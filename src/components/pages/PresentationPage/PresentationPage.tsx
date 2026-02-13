import { useLoaderData } from "react-router-dom";
import type { PresentationLoaderData } from "./presentationTypes";
import "./PresentationPage.css";

function PresentationPage() {
  const { user } = useLoaderData<PresentationLoaderData>();

  return (
    <main className="presentation-page">
      <h1 className="sr-only">Présentation de l'artiste</h1>
      <div className="presentation-info">
        <img
          src={user.avatarUrl ?? "/placeholder.png"}
          alt={user.avatarUrl ? user.username : "Avatar par défaut"}
          className="artist-avatar"
        />
        <div className="artist-names">
          <h2 className="artist-name">{user.username}</h2>
          <h3 className="artist-firstname">{user.firstname ?? ""}</h3>
          <h3 className="artist-lastname">{user.lastname ?? ""}</h3>
        </div>
      </div>
      <p className="artist-bio">{user.bio ?? "Biographie à venir"}</p>
    </main>
  );
}

export default PresentationPage;
