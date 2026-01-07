import { useLoaderData } from "react-router-dom";
import type { ArticleForList } from "../../types/article";
import type { Image } from "../../types/image";
import type { User } from "../../types/users";
import ContactCTA from "../molecules/ContactPreview";
import ArticlesPreview from "../organisms/ArticlesPreview";
import ArtistPreview from "../organisms/ArtistPreview";
import Hero from "../organisms/Hero";

function HomePage() {
  const { articles, imageOfTheDay, user } = useLoaderData() as {
    articles: ArticleForList[];
    imageOfTheDay: Image | null;
    user: User;
  };

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
