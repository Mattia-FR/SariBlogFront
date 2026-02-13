import { useLoaderData } from "react-router-dom";
import ContactCTA from "../../molecules/ContactPreview";
import ArticlesPreview from "../../organisms/ArticlesPreview";
import ArtistPreview from "../../organisms/ArtistPreview";
import Hero from "../../organisms/Hero";
import type { HomeLoaderData } from "./homeTypes";
import "./HomePage.css";

function HomePage() {
  const { articles, imageOfTheDay, user } = useLoaderData<HomeLoaderData>();

  return (
    <section className="home-page">
      <Hero image={imageOfTheDay} />
      <ArticlesPreview articles={articles} />
      <ContactCTA />
      <ArtistPreview user={user} />
    </section>
  );
}

export default HomePage;
