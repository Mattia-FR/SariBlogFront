import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App";
import { ProtectedRoute } from "./components/organisms/ProtectedRoute";
import ArticleCreate from "./components/pages/Admin/Articles/ArticleCreate";
import ArticleEdit from "./components/pages/Admin/Articles/ArticleEdit";
import ArticlesAdmin from "./components/pages/Admin/Articles/ArticlesAdmin";
import Dashboard from "./components/pages/Admin/Dashboard/Dashboard";
import ImagesAdmin from "./components/pages/Admin/Images/ImagesAdmin";
import MessagesAdmin from "./components/pages/Admin/Messages/MessagesAdmin";
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
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import { profileLoader } from "./components/pages/ProfilePage/profileLoader";
import NotFoundPage from "./components/pages/RedirectionPage/NotFoundPage";
import UnauthorizedPage from "./components/pages/RedirectionPage/UnauthorizedPage";
import { AuthProvider } from "./contexts/AuthContext";

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
        path: "/presentation",
        element: <PresentationPage />,
        loader: presentationLoader,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
        loader: profileLoader,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/articles",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ArticlesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/articles/new",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ArticleCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/articles/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ArticleEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/messages",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <MessagesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/images",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ImagesAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Votre document HTML doit contenir un <div id="root"></div>');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
