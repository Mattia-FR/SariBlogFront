import { useLoaderData } from "react-router-dom";
import type { PresentationLoaderData } from "./presentationTypes";

function PresentationPage() {
  const { user } = useLoaderData<PresentationLoaderData>();

  return (
    <main>
      <h1>Présentation</h1>
      <img
        src={user.avatarUrl ?? "/placeholder.png"}
        alt={user.avatarUrl ? user.username : "Avatar par défaut"}
        className="artist-avatar"
      />
      <h3 className="artist-name">
        {user.firstname ?? ""} {user.lastname ?? ""}
      </h3>
      <p className="artist-bio">{user.bio ?? "Biographie à venir"}</p>
    </main>
  );
}

export default PresentationPage;
