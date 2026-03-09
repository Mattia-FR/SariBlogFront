import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App";
import ErrorBoundary from "./components/organisms/ErrorBoundary";
import { ProtectedRoute } from "./components/organisms/ProtectedRoute";
import ArticleCreate from "./components/pages/Admin/Articles/ArticleCreate";
import ArticleEdit from "./components/pages/Admin/Articles/ArticleEdit";
import ArticlesAdmin from "./components/pages/Admin/Articles/ArticlesAdmin";
import CategoriesAdmin from "./components/pages/Admin/Categories/CategoriesAdmin";
import CommentsAdmin from "./components/pages/Admin/Comments/CommentsAdmin";
import Dashboard from "./components/pages/Admin/Dashboard/Dashboard";
import ImageCreate from "./components/pages/Admin/Images/ImageCreate";
import ImageEdit from "./components/pages/Admin/Images/ImageEdit";
import ImagesAdmin from "./components/pages/Admin/Images/ImagesAdmin";
import LoginPage from "./components/pages/Admin/Login/LoginPage";
import MessagesAdmin from "./components/pages/Admin/Messages/MessagesAdmin";
import TagsAdmin from "./components/pages/Admin/Tags/TagsAdmin";
import ArticlePage from "./components/pages/ArticlePage/ArticlePage";
import { articleLoader } from "./components/pages/ArticlePage/articleLoader";
import BlogPage from "./components/pages/BlogPage/BlogPage";
import { blogLoader } from "./components/pages/BlogPage/blogLoader";
import ContactPage from "./components/pages/ContactPage/ContactPage";
import { ErrorPage } from "./components/pages/ErrorPage/ErrorPage";
import GalleryHubPage from "./components/pages/GalleryPage/GalleryHubPage";
import GalleryPage from "./components/pages/GalleryPage/GalleryPage";
import { galleryCategoryLoader } from "./components/pages/GalleryPage/galleryCategoryLoader";
import { galleryHubLoader } from "./components/pages/GalleryPage/galleryHubLoader";
import HomePage from "./components/pages/HomePage/HomePage";
import { homeLoader } from "./components/pages/HomePage/homeLoader";
import LegalNoticePage from "./components/pages/LegalNoticePage/LegalNoticePage";
import PresentationPage from "./components/pages/PresentationPage/PresentationPage";
import { presentationLoader } from "./components/pages/PresentationPage/presentationLoader";
import PrivacyPolicyPage from "./components/pages/PrivacyPolicyPage/PrivacyPolicyPage";
import ProfilePage from "./components/pages/ProfilePage/ProfilePage";
import { profileLoader } from "./components/pages/ProfilePage/profileLoader";
import NotFoundPage from "./components/pages/RedirectionPage/NotFoundPage";
import UnauthorizedPage from "./components/pages/RedirectionPage/UnauthorizedPage";
import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <ErrorPage />,
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
        element: <GalleryHubPage />,
        loader: galleryHubLoader,
      },
      {
        path: "/gallery/:slug",
        element: <GalleryPage />,
        loader: galleryCategoryLoader,
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
        path: "/mentions-legales",
        element: <LegalNoticePage />,
      },
      {
        path: "/politique-confidentialite",
        element: <PrivacyPolicyPage />,
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
        path: "/login",
        element: <LoginPage />,
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
        path: "/admin/comments",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <CommentsAdmin />
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
        path: "/admin/images/new",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ImageCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/images/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <ImageEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/tags",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <TagsAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/categories",
        element: (
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <CategoriesAdmin />
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
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
