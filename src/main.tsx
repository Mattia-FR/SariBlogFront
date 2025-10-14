import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App.tsx";
// Imports admin
import AdminLayout from "./components/layouts/AdminLayout.tsx";
import About from "./components/pages/About.tsx";
import ArticleDetail from "./components/pages/ArticleDetail.tsx";
import ArticlesPage from "./components/pages/Articles.tsx";
import AdminAbout from "./components/pages/admin/AdminAbout.tsx";
import AdminArticles from "./components/pages/admin/AdminArticles.tsx";
import AdminIllustrations from "./components/pages/admin/AdminIllustrations.tsx";
import AdminLogin from "./components/pages/admin/AdminLogin.tsx";
import AdminMessages from "./components/pages/admin/AdminMessages.tsx";
import AdminTags from "./components/pages/admin/AdminTags.tsx";
import Contact from "./components/pages/Contact.tsx";
import Gallery from "./components/pages/Gallery.tsx";
import GalleryDetail from "./components/pages/GalleryDetail.tsx";
import HomePage from "./components/pages/HomePage.tsx";
// Imports des loaders externalisés
import { swrConfig } from "./config/swr.ts";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { aboutPageLoader } from "./loaders/aboutLoader.ts";
import {
  adminAboutLoader,
  adminArticlesLoader,
  adminIllustrationsLoader,
  adminLoader,
  adminMessagesLoader,
  adminTagsLoader,
} from "./loaders/adminLoaders.ts";
import {
  articleDetailLoader,
  articlesPageLoader,
} from "./loaders/articlesLoaders.ts";
import {
  galleryDetailLoader,
  galleryPageLoader,
} from "./loaders/galleryLoaders.ts";
import { homePageLoader } from "./loaders/homeLoader.ts";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homePageLoader,
      },
      {
        path: "/blog",
        element: <ArticlesPage />,
        loader: articlesPageLoader,
      },
      {
        path: "/gallery",
        element: <Gallery />,
        loader: galleryPageLoader,
      },
      {
        path: "/gallery/:id",
        element: <GalleryDetail />,
        loader: galleryDetailLoader,
      },
      {
        path: "/article/:slug",
        element: <ArticleDetail />,
        loader: articleDetailLoader,
      },
      {
        path: "/about",
        element: <About />,
        loader: aboutPageLoader,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  // Routes admin
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: adminLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/articles" replace />,
      },
      {
        path: "articles",
        element: <AdminArticles />,
        loader: adminArticlesLoader,
      },
      {
        path: "illustrations",
        element: <AdminIllustrations />,
        loader: adminIllustrationsLoader,
      },
      {
        path: "messages",
        element: <AdminMessages />,
        loader: adminMessagesLoader,
      },
      {
        path: "tags",
        element: <AdminTags />,
        loader: adminTagsLoader,
      },
      {
        path: "about",
        element: <AdminAbout />,
        loader: adminAboutLoader,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
]);

const rootElement = document.getElementById("root");

if (rootElement == null) {
  throw new Error(`Your HTML Document must contain a <div id="root"></div>`);
} else {
  // On crée la racine React avec SWR configuré pour l'approche hybride
  ReactDOM.createRoot(rootElement).render(
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SWRConfig>,
  );
}
