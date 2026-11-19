import { useLoaderData } from "react-router-dom";
import type { PresentationLoaderData } from "./presentationTypes";
import "./PresentationPage.css";

function PresentationPage() {
  const { user } = useLoaderData<PresentationLoaderData>();

  return (
    <section className="presentation-page">
      <div
        className="presentation-hero"
        aria-labelledby="presentation-title"
      >
        <div className="presentation-visual">
          <img
            className="presentation-image"
            src={user.avatarUrl ?? "/placeholder.png"}
            alt={user.avatarUrl ? user.username : "Avatar par défaut"}
          />
        </div>
        <div className="presentation-content">
          <div className="presentation-copy">
            <p className="presentation-overline">À propos</p>
            <h1 id="presentation-title" className="presentation-name">
              <span>Sari</span>
              <span className="presentation-surname">Eliott</span>
            </h1>
            <p className="presentation-tagline">Illustratrice</p>
          </div>
          <p className="presentation-bio">
            {user.bio ?? "Biographie à venir"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default PresentationPage;
