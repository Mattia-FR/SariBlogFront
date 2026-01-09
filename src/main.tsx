import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App";
import ArticlePage from "./components/pages/ArticlePage/ArticlePage";
import { articleLoader } from "./components/pages/ArticlePage/articleLoader";
import BlogPage from "./components/pages/BlogPage/BlogPage";
import { blogLoader } from "./components/pages/BlogPage/blogLoader";
import ContactPage from "./components/pages/ContactPage/ContactPage";
import GalleryPage from "./components/pages/GalleryPage/GalleryPage";
import { galleryLoader } from "./components/pages/GalleryPage/galleryLoader";
import HomePage from "./components/pages/HomePage/HomePage";
import { homeLoader } from "./components/pages/HomePage/homeLoader";
import PresentationPage from "./components/pages/PresentationPage/PresentationPage";
import { presentationLoader } from "./components/pages/PresentationPage/presentationLoader";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "/blog",
        element: <BlogPage />,
        loader: blogLoader,
      },
      {
        path: "/blog/:slug",
        element: <ArticlePage />,
        loader: articleLoader,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
        loader: galleryLoader,
      },
      {
        path: "/about",
        element: <PresentationPage />,
        loader: presentationLoader,
      },
      {
        path: "/contact",
        element: <ContactPage />,
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
