import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App";
import ArticlePage from "./components/pages/ArticlePage";
import BlogPage from "./components/pages/BlogPage";
import GalleryPage from "./components/pages/GalleryPage";
import HomePage from "./components/pages/Homepage";

import type { Article, ArticleForList, ArticleListItem } from "./types/article";
import type { Image, ImageForArticle } from "./types/image";
import type { User } from "./types/users";

import { api } from "./utils/api";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      /**
       * Homepage
       * Endpoint enrichi (articles + image + tags)
       */
      {
        path: "/",
        element: <HomePage />,
        loader: async () => {
          const articles = await api.get<ArticleForList[]>(
            "/articles/homepage-preview",
          );

          const imageOfTheDay = await api.get<Image | null>(
            "/images/image-of-the-day",
          );

          const user = await api.get<User>("/users/artist");

          return { articles, imageOfTheDay, user };
        },
      },

      /**
       * Blog – liste simple
       * ❗ PAS d’enrichissement garanti
       */
      {
        path: "/blog",
        element: <BlogPage />,
        loader: async () => {
          const articles = await api.get<ArticleListItem[]>(
            "/articles/published",
          );

          return { articles };
        },
      },

      /**
       * Article détaillé
       */
      {
        path: "/blog/:slug",
        element: <ArticlePage />,
        loader: async ({ params }) => {
          if (!params.slug) {
            throw new Response("Not Found", { status: 404 });
          }

          const article = await api.get<Article>(
            `/articles/published/${params.slug}`,
          );

          const articleImages = await api.get<ImageForArticle[]>(
            `/images/article/${article.id}`,
          );

          return { article, articleImages };
        },
      },

      /**
       * Galerie
       */
      {
        path: "/gallery",
        element: <GalleryPage />,
        loader: async () => {
          const images = await api.get<Image[]>("/images/gallery");

          return { images };
        },
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Your HTML Document must contain a <div id="root"></div>');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
