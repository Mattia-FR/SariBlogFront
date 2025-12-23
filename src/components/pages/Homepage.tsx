import { useLoaderData } from "react-router-dom";
import type { ArticleForList } from "../../types/article";
import type { ImageWithUrl } from "../../types/image";
import ArticlesPreview from "../organisms/ArticlesPreview";
import Hero from "../organisms/Hero";

function HomePage() {
  const { articles, imageOfTheDay } = useLoaderData() as {
    articles: ArticleForList[];
    imageOfTheDay: ImageWithUrl | null;
  };

  return (
    <section className="home-page">
      <Hero image={imageOfTheDay} />
      <ArticlesPreview articles={articles} />
    </section>
  );
}

export default HomePage;
