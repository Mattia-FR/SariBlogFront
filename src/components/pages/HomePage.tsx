import { useLoaderData } from "react-router-dom";
import type { HomePageData } from "../../types/homePage";
import ContactCTA from "../molecules/ContactCTA";
import AboutPreview from "../organisms/AboutPreview";
import ArticlesPreview from "../organisms/ArticlesPreview";
import GalleryPreview from "../organisms/GalleryPreview";
import Hero from "../organisms/Hero";

import "./HomePage.css";

function HomePage() {
  const { articles, illustrations, about } = useLoaderData() as HomePageData;

  return (
    <section className="home-page">
      <Hero />
      <ArticlesPreview articles={articles} />
      <GalleryPreview illustrations={illustrations} />
      <section className="home-bottom">
        <AboutPreview about={about} />
        <ContactCTA />
      </section>
    </section>
  );
}

export default HomePage;
