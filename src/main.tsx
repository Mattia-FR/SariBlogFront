import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  RouterProvider,
} from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App.tsx";
import About from "./components/pages/About.tsx";
import ArticleDetail from "./components/pages/ArticleDetail.tsx";
import ArticlesPage from "./components/pages/Articles.tsx";
import Contact from "./components/pages/Contact.tsx";
import Gallery from "./components/pages/Gallery.tsx";
import GalleryDetail from "./components/pages/GalleryDetail.tsx";
import HomePage from "./components/pages/HomePage.tsx";
// On importe "axios" ainsi
import { api } from "./lib/api.ts";

// Configuration SWR avec fetch
// const fetcher = (...args) => fetch(...args).then(res => res.json());
// Configuration SWR globale mais avec axios :
const fetcher = (url: string) => api.get(url).then((res) => res.data);

// Configuration SWR optimisée pour l'approche hybride
const swrConfig = {
  fetcher,
  revalidateOnFocus: true, // Revalider quand l'utilisateur revient sur l'onglet
  revalidateOnReconnect: true, // Revalider si la connexion revient
  revalidateOnMount: false, // Ne pas revalider immédiatement (données du loader)
  dedupingInterval: 60000, // 1 minute de déduplication
  errorRetryCount: 3, // Retry automatique en cas d'erreur
  errorRetryInterval: 5000, // 5 secondes entre les retry
  onError: (error: Error) => {
    console.error("SWR Error:", error);
    // Ici vous pourriez ajouter un système de notifications
  },
  onSuccess: (data: Record<string, unknown>, key: string) => {
    console.log(`✅ SWR Success for ${key}:`, data);
  },
};

// Loader spécifique pour la page d'accueil
const homePageLoader = async () => {
  try {
    console.log("🔍 Début du loader...");

    const { data: articlesData } = await api.get("/articles/latest?limit=4");
    console.log("✅ Articles:", articlesData);

    const { data: illustrationsData } = await api.get(
      "/illustrations/gallery-preview",
    );
    console.log("✅ Illustrations:", illustrationsData);

    const { data: aboutData } = await api.get("/about");
    console.log("✅ About:", aboutData);

    return {
      articles: articlesData?.data?.articles || [],
      illustrations: illustrationsData?.data?.illustrations || [],
      about: aboutData?.data?.about || null,
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader:", error);
    return {
      articles: [],
      illustrations: [],
      about: null,
    };
  }
};

const articlesPageLoader = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const limit = Number.parseInt(url.searchParams.get("limit") || "12", 10);
    const offset = Number.parseInt(url.searchParams.get("offset") || "0", 10);

    const { data } = await api.get(`/articles?limit=${limit}&offset=${offset}`);

    return {
      articles: data?.data?.articles || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader articles:", error);
    return {
      articles: [],
      pagination: {
        limit: 12,
        offset: 0,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }
};

const articleDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const slug = params.slug;
    if (!slug) {
      throw new Response("Slug manquant", { status: 400 });
    }

    const { data } = await api.get(`/articles/slug/${slug}`);

    return {
      article: data?.data?.article || null,
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader article detail:", error);
    throw new Response("Article non trouvé", { status: 404 });
  }
};

const galleryPageLoader = async ({ request }: { request: Request }) => {
  try {
    const url = new URL(request.url);
    const limit = Number.parseInt(url.searchParams.get("limit") || "12", 10);
    const offset = Number.parseInt(url.searchParams.get("offset") || "0", 10);

    const { data } = await api.get(
      `/illustrations?limit=${limit}&offset=${offset}`,
    );

    return {
      illustrations: data?.data?.illustrations || [],
      pagination: data?.data?.pagination || {
        limit,
        offset,
        totalCount: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader galerie:", error);
    return {
      illustrations: [],
      pagination: {
        limit: 12,
        offset: 0,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }
};

const galleryDetailLoader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const id = params.id;
    if (!id) {
      throw new Response("ID manquant", { status: 400 });
    }

    const { data } = await api.get(`/illustrations/${id}`);

    return {
      illustration: data?.data?.illustration || null,
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader illustration detail:", error);
    throw new Response("Illustration non trouvée", { status: 404 });
  }
};

const aboutPageLoader = async () => {
  try {
    const { data } = await api.get("/about");
    return {
      about: data?.data?.about || null,
    };
  } catch (error) {
    console.error("❌ Erreur dans le loader about:", error);
    return {
      about: null,
    };
  }
};

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: homePageLoader, // On utilise le loader de la page
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
]);

const rootElement = document.getElementById("root");

if (rootElement == null) {
  throw new Error(`Your HTML Document must contain a <div id="root"></div>`);
} else {
  // On crée la racine React avec SWR configuré pour l'approche hybride
  ReactDOM.createRoot(rootElement).render(
    <SWRConfig value={swrConfig}>
      <RouterProvider router={router} />
    </SWRConfig>,
  );
}
