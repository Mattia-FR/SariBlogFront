import { useLoaderData } from "react-router-dom";
import { useAbout } from "../../hooks/useAbout";
import { useIllustrations } from "../../hooks/useIllustrations";
import { useLatestArticles } from "../../hooks/useLatestArticles";
import type { HomePageData } from "../../types/homePage";
import ContactCTA from "../molecules/ContactCTA";
import AboutPreview from "../organisms/AboutPreview";
import ArticlesPreview from "../organisms/ArticlesPreview";
import GalleryPreview from "../organisms/GalleryPreview";
import Hero from "../organisms/Hero";

import "./HomePage.css";

function HomePage() {
  // Garder : données du loader (premier rendu)
  const { articles, illustrations, about } = useLoaderData() as HomePageData;

  // Ajouter : hooks SWR avec fallback (revalidation en arrière-plan)
  const { data: articlesData } = useLatestArticles(4, articles);
  const { data: illustrationsData } = useIllustrations(illustrations);
  const { data: aboutData } = useAbout(about);

  return (
    <section className="home-page">
      <Hero />
      <ArticlesPreview articles={articlesData?.data?.articles || articles} />
      <GalleryPreview
        illustrations={illustrationsData?.data?.illustrations || illustrations}
      />
      <section className="home-bottom">
        <AboutPreview about={aboutData?.data?.about || about} />
        <ContactCTA />
      </section>
    </section>
  );
}

export default HomePage;
