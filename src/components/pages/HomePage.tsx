import { useLoaderData } from "react-router-dom";
import type { Article } from "../../types/article";
import type { Illustration } from "../../types/illustration";

import ArticlesPreview from "../organisms/ArticlesPreview";
import GalleryPreview from "../organisms/GalleryPreview";
import Hero from "../organisms/Hero";

import "./HomePage.css";

type HomePageData = {
  articles: Article[];
  illustrations: Illustration[];
};

function HomePage() {
  const { articles, illustrations } = useLoaderData() as HomePageData;

  return (
    <div className="home-page">
      <Hero />
      <ArticlesPreview articles={articles} />
      <GalleryPreview illustrations={illustrations} />
    </div>
  );
}

export default HomePage;
