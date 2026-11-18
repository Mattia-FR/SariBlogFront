# Sariblog — Frontend

> Interface React du CMS Sariblog, développée pour ma sœur illustratrice.
> Première application React complète avec authentification et espace admin.

## Contexte

Frontend du projet Sariblog (voir [backend](https://github.com/Mattia-FR/SariBlogBack)), créé pour gérer le portfolio professionnel de ma sœur. Premier projet où je construis une application React complète avec routing, authentification et état global léger via React Context (auth).

**Objectifs techniques :**
- Maîtriser React Router pour une SPA multi-pages
- Implémenter un système d'auth côté client (JWT + refresh)
- Créer un backoffice fonctionnel (CRUD, gestion de contenu)
- Découvrir Zod pour la validation de formulaires

**Statut :** En cours de développement (lié au backend)

## Particularités techniques

- **Gestion du token** : Stockage en mémoire (pas localStorage)
  avec refresh automatique via cookie HttpOnly
- **Routes protégées** : Système de rôles (admin/editor) avec
  ProtectedRoute
- **Architecture** : Organisation en `atoms` / `molecules` / `organisms` / `pages`
  inspirée d'Atomic Design

## Stack technique

| Catégorie         | Technologie        |
|-------------------|--------------------|
| **UI**            | React 19           |
| **Langage**       | TypeScript 5.8     |
| **Build / Dev**   | Vite 7             |
| **Routing**       | React Router 7     |
| **Validation**    | Zod 4              |
| **Notifications** | react-toastify 11  |
| **Icônes**        | lucide-react       |
| **Tests**         | Vitest 4           |
| **Lint / Format** | Biome 2            |

## Prérequis

- **Node.js** 20.19+ ou 22.12+ (requis par Vite 7)
- Backend Sariblog démarré (par défaut : `http://localhost:4242`)

## Installation

```bash
cd Front
npm install
```

## Configuration

Variables d'environnement (optionnelles) :

| Variable       | Description                   | Défaut                      |
|----------------|-------------------------------|-----------------------------|
| `VITE_API_URL` | URL de base de l'API backend  | `http://localhost:4242/api` |

Un fichier `.env.example` est fourni à la racine de `Front`. Copier en `.env` si besoin :

```env
VITE_API_URL=http://localhost:4242/api
```

### API et CORS (pas de proxy Vite)

Le client appelle l'API directement (`fetch` vers `VITE_API_URL`). Il n'y a **pas** de `server.proxy` dans `vite.config.ts`. Le backend doit autoriser l'origine du serveur de développement (souvent `http://localhost:5173`) et les cookies (`credentials: "include"` sur toutes les requêtes).

## Scripts

| Commande             | Description                                         |
|----------------------|-----------------------------------------------------|
| `npm run dev`        | Serveur de développement (Vite)                     |
| `npm run build`      | Compilation TypeScript + build prod                 |
| `npm run preview`    | Prévisualisation du build                           |
| `npm test`           | Tests unitaires (Vitest, une fois)                  |
| `npm run test:watch` | Tests unitaires en mode watch                       |
| `npm run check`      | Vérification du code (Biome, lecture seule)         |
| `npm run format`     | Formatage automatique (Biome)                       |
| `npm run lint`       | Lint + format + corrections (Biome)                 |

## Structure du projet

```
Front/
├── public/
├── src/
│   ├── components/
│   │   ├── atoms/         # Composants très simples (ex. pagination)
│   │   ├── molecules/     # Cartes, formulaires, navbar, footer, modale…
│   │   ├── organisms/     # Header, Hero, ErrorBoundary, ProtectedRoute…
│   │   └── pages/         # Pages et loaders par route
│   │       ├── Admin/
│   │       │   ├── Articles/      # ArticlesAdmin, ArticleCreate, ArticleEdit
│   │       │   ├── Categories/    # CategoriesAdmin
│   │       │   ├── Comments/      # CommentsAdmin
│   │       │   ├── Dashboard/     # Dashboard
│   │       │   ├── Images/        # ImagesAdmin, ImageCreate, ImageEdit
│   │       │   ├── Login/         # LoginPage
│   │       │   ├── Messages/      # MessagesAdmin
│   │       │   ├── Profile/       # ProfilePage
│   │       │   └── Tags/          # TagsAdmin
│   │       ├── ArticlePage/       # ArticlePage + articleLoader
│   │       ├── BlogPage/          # BlogPage + blogLoader
│   │       ├── ContactPage/
│   │       ├── ErrorPage/
│   │       ├── GalleryPage/       # GalleryHubPage + GalleryPage + galleryHubLoader + galleryCategoryLoader
│   │       ├── HomePage/          # HomePage + homeLoader
│   │       ├── LegalNoticePage/
│   │       ├── PresentationPage/  # PresentationPage + presentationLoader
│   │       ├── PrivacyPolicyPage/
│   │       └── RedirectionPage/   # NotFoundPage, UnauthorizedPage
│   ├── contexts/          # AuthContext
│   ├── hooks/             # useAuth
│   ├── schemas/           # Schémas de validation Zod
│   ├── tests/unit/        # Tests apiClient, apiError, loaderFetch, errorContent
│   ├── types/             # article, auth, categories, comment, image, messages, modal, pagination, tags, users
│   ├── utils/             # apiClient, loaderFetch, apiError, logger, notifyError, imageConstraints
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx           # createBrowserRouter, AuthProvider, ErrorBoundary
│   ├── index.css
│   └── toast.css
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── biome.json
```

## Routes

| Chemin                          | Accès           | Description                   |
|---------------------------------|-----------------|-------------------------------|
| `/`                             | Public          | Accueil                       |
| `/blog`                         | Public          | Liste des articles            |
| `/blog/:slug`                   | Public          | Article par slug              |
| `/gallery`                      | Public          | Hub galerie (catégories)      |
| `/gallery/:slug`                | Public          | Galerie d'une catégorie       |
| `/presentation`                 | Public          | Présentation de l'artiste     |
| `/contact`                      | Public          | Formulaire de contact         |
| `/mentions-legales`             | Public          | Mentions légales              |
| `/politique-confidentialite`    | Public          | Politique de confidentialité  |
| `/login`                        | Public          | Page de connexion             |
| `/admin`                        | Admin / Editor  | Tableau de bord               |
| `/admin/profile`                | Admin / Editor  | Profil utilisateur            |
| `/admin/articles`               | Admin / Editor  | Gestion des articles          |
| `/admin/articles/new`           | Admin / Editor  | Création d'article            |
| `/admin/articles/edit/:id`      | Admin / Editor  | Édition d'article             |
| `/admin/messages`               | Admin / Editor  | Messages de contact           |
| `/admin/comments`               | Admin / Editor  | Modération des commentaires   |
| `/admin/images`                 | Admin / Editor  | Gestion des images            |
| `/admin/images/new`             | Admin / Editor  | Ajout d'image                 |
| `/admin/images/edit/:id`        | Admin / Editor  | Édition d'image               |
| `/admin/tags`                   | Admin / Editor  | Gestion des tags              |
| `/admin/categories`             | Admin / Editor  | Gestion des catégories        |
| `/unauthorized`                 | Public          | Accès refusé                  |
| `*`                             | Public          | 404                           |

## Loaders de routes

Plusieurs routes utilisent un [loader React Router](https://reactrouter.com/en/main/route/loader) pour précharger les données avant le rendu :

| Route              | Loader                    | Endpoints (relatifs à `VITE_API_URL`) |
|--------------------|---------------------------|----------------------------------------|
| `/`                | `homeLoader`              | `GET /articles/homepage-preview` ; `GET /images/image-of-the-day` (optionnel) ; `GET /users/artist` |
| `/blog`            | `blogLoader`              | `GET /articles/published?page&tagId` ; `GET /tags/published-articles` (optionnel) |
| `/blog/:slug`      | `articleLoader`           | `GET /articles/published/slug/:slug` ; puis optionnels `GET /images/article/:id`, `GET /tags/article/:id`, `GET /comments/article/:id` |
| `/gallery`         | `galleryHubLoader`        | `GET /categories` |
| `/gallery/:slug`   | `galleryCategoryLoader`   | `GET /categories/:slug` ; `GET /images/category/:id?page&limit&tagId` ; `GET /tags/category/:id` (optionnel) |
| `/presentation`    | `presentationLoader`      | `GET /users/artist` |

Les loaders utilisent `loaderFetch<T>()` pour les données critiques (erreur → `ErrorPage`) et `loaderFetchOptional<T>()` pour les données secondaires (repli sans faire échouer la route), depuis `src/utils/loaderFetch.ts`.

## Client API

Le module `src/utils/apiClient.ts` fournit :

- **`apiClient(url, options)`** : `fetch` avec injection du token Bearer, `credentials: "include"` sur toutes les requêtes, et retry sur 401 après refresh
- **`api.get<T>(endpoint)`** : requête GET, retourne le JSON
- **`api.post<T>(endpoint, data?)`** : requête POST JSON
- **`api.postFormData<T>(endpoint, formData)`** : requête POST multipart (upload d'image, sans `Content-Type` manuel)
- **`api.patch<T>(endpoint, data?)`** : requête PATCH JSON
- **`api.delete<T>(endpoint)`** : requête DELETE (gère le statut 204)
- **Refresh token** : appel automatique à `POST /auth/refresh` avec cookie httpOnly, puis réessai de la requête avec le nouveau token
- **Erreurs** : normalisées en `ApiError` ; les loaders les convertissent en `Response` via `toRouteErrorResponse`

Le module `src/utils/loaderFetch.ts` fournit :

- **`loaderFetch<T>(endpoint)`** : appelle `api.get<T>()` et convertit les erreurs en `Response` exploitable par React Router
- **`loaderFetchOptional<T>(endpoint, fallback)`** : même appel, mais renvoie le fallback en cas d'erreur (données secondaires)

Le token d'accès est stocké **en mémoire** (variable JS), pas dans `localStorage`.

## Contexte d'authentification

`AuthContext` expose :

- État : `user`, `isInitializing`, `isLoading`
- Actions : `login`, `logout`, `setCurrentUser` (mise à jour du user côté client)
- Au chargement : `POST /auth/refresh` (cookie) via `refreshAccessToken()`, puis si succès `GET /admin/users/me` pour hydrater `user`

Les routes admin sont enveloppées dans `ProtectedRoute` avec `allowedRoles={["admin", "editor"]}`.

## Schémas de validation Zod

Les schémas se trouvent dans `src/schemas/` :

| Fichier               | Export                     | Usage                                     |
|-----------------------|----------------------------|-------------------------------------------|
| `authSchemas.ts`      | `loginSchema`              | Formulaire de connexion (`identifier`, `password`) |
| `commentSchemas.ts`   | `commentCreateSchema`      | Formulaire de commentaire public          |
| `messageSchemas.ts`   | `messageVisitorSchema`     | Formulaire de contact                     |
| `userSchemas.ts`      | `updateMePasswordSchema`   | Changement de mot de passe (profil admin) |

## Configuration Biome

- Formatage : espaces, guillemets doubles
- Règles recommandées activées
- Organisation automatique des imports (`organizeImports`)

## Lien avec le backend

Le frontend attend une API REST documentée dans le [README du backend](https://github.com/Mattia-FR/SariBlogBack/blob/main/README.md). En développement, lancer le backend (ex. port 4242) puis :

```bash
npm run dev
```

L'app sera servie par Vite (souvent `http://localhost:5173`).

---

*Frontend du projet Sariblog — blog/portfolio CMS.*
