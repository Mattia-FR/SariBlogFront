import { useLoaderData } from "react-router-dom";
import ContactCTA from "../../molecules/ContactPreview";
import Quote from "../../molecules/Quote";
import ArticlesPreview from "../../organisms/ArticlesPreview";
import ArtistPreview from "../../organisms/ArtistPreview";
import GalleryPreview from "../../organisms/GalleryPreview";
import Hero from "../../organisms/Hero";
import type { HomeLoaderData } from "./homeTypes";
import "./HomePage.css";

function HomePage() {
  const { articles, galleryPreview, imageOfTheDay, user } =
    useLoaderData<HomeLoaderData>();

  return (
    <section className="home-page">
      <Hero image={imageOfTheDay} />
      <GalleryPreview images={galleryPreview} />
      <Quote />
      <ArticlesPreview articles={articles} />
      <ContactCTA />
      <ArtistPreview user={user} />
    </section>
  );
}

export default HomePage;
