import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import HomePage from "./components/pages/Homepage.tsx";
import type { ArticleForList } from "./types/article.ts";
import { api } from "./utils/api.ts";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: async () => {
          const articles = await api.get<ArticleForList[]>(
            "/articles/homepage-preview",
          );

          return { articles };
        },
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (rootElement == null) {
  throw new Error(`Your HTML Document must contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
