import { useLoaderData } from "react-router-dom";
import type { Article } from "../../types/article";
import type { Illustration } from "../../types/illustration";

import ArticlesPreview from "../organisms/ArticlesPreview";
import GalleryPreview from "../organisms/GalleryPreview";
import Hero from "../organisms/Hero";

import "./HomePage.css";
import type { About } from "../../types/about";
import ContactCTA from "../molecules/ContactCTA";
import AboutPreview from "../organisms/AboutPreview";

type HomePageData = {
  articles: Article[];
  illustrations: Illustration[];
  about: About;
};

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
