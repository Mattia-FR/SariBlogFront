import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";

import App from "./App.tsx";
import HomePage from "./components/pages/HomePage.tsx";

// On importe "axios" ainsi
import { api } from "./lib/api.ts";

import "./index.css";

// Configuration SWR avec fetch
// const fetcher = (...args) => fetch(...args).then(res => res.json());
// Configuration SWR globale mais avec axios :
const fetcher = (url: string) => api.get(url).then((r) => r.data);

// Loader spécifique pour la page d'accueil
const homePageLoader = async () => {
  const articles = await api.get("/articles/latest?limit=4");
  return articles.data;
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
