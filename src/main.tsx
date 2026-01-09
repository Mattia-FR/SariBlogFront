import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  type LoaderFunction,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import App from "./App";
import ArticlePage from "./components/pages/ArticlePage/ArticlePage";
import { articleLoader } from "./components/pages/ArticlePage/articleLoader";
import type { ArticleLoaderData } from "./components/pages/ArticlePage/articleTypes";
import BlogPage from "./components/pages/BlogPage/BlogPage";
import { blogLoader } from "./components/pages/BlogPage/blogLoader";
import type { BlogLoaderData } from "./components/pages/BlogPage/blogTypes";
import GalleryPage from "./components/pages/GalleryPage/GalleryPage";
import { galleryLoader } from "./components/pages/GalleryPage/galleryLoader";
import type { GalleryLoaderData } from "./components/pages/GalleryPage/galleryTypes";
import HomePage from "./components/pages/HomePage/HomePage";
import { homeLoader } from "./components/pages/HomePage/homeLoader";
import type { HomeLoaderData } from "./components/pages/HomePage/homeTypes";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homeLoader as LoaderFunction<HomeLoaderData>,
      },
      {
        path: "/blog",
        element: <BlogPage />,
        loader: blogLoader as LoaderFunction<BlogLoaderData>,
      },
      {
        path: "/blog/:slug",
        element: <ArticlePage />,
        loader: articleLoader as LoaderFunction<ArticleLoaderData>,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
        loader: galleryLoader as LoaderFunction<GalleryLoaderData>,
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
