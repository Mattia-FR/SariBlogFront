import { useLoaderData } from "react-router-dom";
import type { Article } from "../../types/article";

import ArticlesPreview from "../organisms/ArticlesPreview";
import Hero from "../organisms/Hero";

import "./HomePage.css";

function HomePage() {
  const articles = useLoaderData() as Article[];

  return (
    <div className="home-page">
      <Hero />
      <ArticlesPreview articles={articles} />
    </div>
  );
}

export default HomePage;
