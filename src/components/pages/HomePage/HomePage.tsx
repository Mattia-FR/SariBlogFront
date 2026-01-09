import { useLoaderData } from "react-router-dom";
import ContactCTA from "../../molecules/ContactPreview";
import ArticlesPreview from "../../organisms/ArticlesPreview";
import ArtistPreview from "../../organisms/ArtistPreview";
import Hero from "../../organisms/Hero";
import type { HomeLoaderData } from "./homeTypes";

function HomePage() {
  const { articles, imageOfTheDay, user } = useLoaderData<HomeLoaderData>();

  return (
    <section className="home-page">
      <Hero image={imageOfTheDay} />
      <ArticlesPreview articles={articles} />
      <ArtistPreview user={user} />
      <ContactCTA />
    </section>
  );
}

export default HomePage;
