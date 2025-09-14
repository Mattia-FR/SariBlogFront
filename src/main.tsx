import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  type LoaderFunctionArgs,
  RouterProvider,
} from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App.tsx";
import ArticleDetail from "./components/pages/ArticleDetail.tsx";
import ArticlesPage from "./components/pages/Articles.tsx";
import HomePage from "./components/pages/HomePage.tsx";
// On importe "axios" ainsi
import { api } from "./lib/api.ts";

// Configuration SWR avec fetch
// const fetcher = (...args) => fetch(...args).then(res => res.json());
// Configuration SWR globale mais avec axios :
const fetcher = (url: string) => api.get(url).then((res) => res.data);

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
        path: "/article/:slug",
        element: <ArticleDetail />,
        loader: articleDetailLoader,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement == null) {
  throw new Error(`Your HTML Document must contain a <div id="root"></div>`);
} else {
  // On crée la racine React avec SWR configuré pour utiliser useSWR() dans les composants
  ReactDOM.createRoot(rootElement).render(
    <SWRConfig value={{ fetcher }}>
      <RouterProvider router={router} />
    </SWRConfig>,
  );
}
