# Sariblog — Frontend

> Interface React du CMS Sariblog, développée pour ma sœur illustratrice.
> Première application React complète avec authentification et espace admin.

## 🎯 Contexte

Frontend du projet Sariblog (voir [backend](https://github.com/Mattia-FR/SariBlogBack)), créé pour gérer le portfolio professionnel de ma sœur. Premier projet où je construis une application React complète avec routing, authentification et gestion d'état.

**Objectifs techniques :**
- Maîtriser React Router pour une SPA multi-pages
- Implémenter un système d'auth côté client (JWT + refresh)
- Créer un backoffice fonctionnel (CRUD, gestion de contenu)
- Découvrir Zod pour la validation de formulaires

**Statut :** En cours de développement (lié au backend)

## 💡 Particularités techniques

- **Gestion du token** : Stockage en mémoire (pas localStorage) 
  avec refresh automatique via cookie HttpOnly
- **Routes protégées** : Système de rôles (admin/editor) avec 
  ProtectedRoute
- **Architecture** : Organisation en components/organisms/pages 
  inspirée d'Atomic Design

## Stack technique

| Catégorie        | Technologie        |
|------------------|--------------------|
| **UI**           | React 19           |
| **Langage**      | TypeScript 5.8     |
| **Build / Dev**  | Vite 7             |
| **Routing**      | React Router 7     |
| **Validation**   | Zod 4              |
| **Lint / Format**| Biome 2            |

## Prérequis

- **Node.js** 18+
- Backend Sariblog démarré (par défaut : `http://localhost:4242`)

## Installation

```bash
cd Front
npm install
```

## Configuration

Variables d’environnement (optionnelles) :

| Variable       | Description                    | Défaut                    |
|----------------|--------------------------------|---------------------------|
| `VITE_API_URL` | URL de base de l’API backend   | `http://localhost:4242/api` |

Créer un fichier `.env` à la racine de `Front` si besoin :

```env
VITE_API_URL=http://localhost:4242/api
```

## Scripts

| Commande        | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Serveur de développement (Vite)     |
| `npm run build` | Compilation TypeScript + build prod  |
| `npm run preview` | Prévisualisation du build          |
| `npm run check` | Vérification du code (Biome, lecture seule) |
| `npm run format`| Formatage automatique (Biome)        |
| `npm run lint`  | Lint + format + corrections (Biome)  |

## Structure du projet

```
Front/
├── public/
├── src/
│   ├── components/
│   │   ├── molecules/     # Cartes, formulaires, navbar, footer, modale…
│   │   ├── organisms/     # Header, Hero, Login, ProtectedRoute…
│   │   └── pages/         # Pages et loaders par route
│   │       ├── Admin/     # Dashboard, Articles, Messages, Images
│   │       ├── ArticlePage/
│   │       ├── BlogPage/
│   │       ├── ContactPage/
│   │       ├── GalleryPage/
│   │       ├── HomePage/
│   │       ├── PresentationPage/
│   │       ├── ProfilePage/
│   │       └── RedirectionPage/  # 404, Unauthorized
│   ├── contexts/          # AuthContext, ModalContext
│   ├── hooks/             # useAuth, useModal
│   ├── types/             # article, auth, image, messages, users…
│   ├── utils/             # apiClient (JWT + refresh)
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx           # Router + providers
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── biome.json
```

## Routes

| Chemin | Accès | Description |
|--------|--------|-------------|
| `/` | Public | Accueil |
| `/blog` | Public | Liste des articles |
| `/blog/:slug` | Public | Article par slug |
| `/gallery` | Public | Galerie d’images |
| `/presentation` | Public | Présentation |
| `/contact` | Public | Formulaire de contact |
| `/admin` | Admin / Editor | Tableau de bord |
| `/admin/articles` | Admin / Editor | Gestion des articles |
| `/admin/articles/new` | Admin / Editor | Création d’article |
| `/admin/articles/edit/:id` | Admin / Editor | Édition d’article |
| `/admin/messages` | Admin / Editor | Messages de contact |
| `/admin/images` | Admin / Editor | Gestion des images |
| `/unauthorized` | Public | Accès refusé |
| `*` | Public | 404 |

## Client API

Le module `src/utils/apiClient.ts` fournit :

- **`apiClient(url, options)`** : `fetch` avec injection du token Bearer et retry sur 401 après refresh
- **`api.get/post/patch/delete(endpoint)`** : helpers qui appellent `apiClient` et renvoient le JSON (ou lèvent une erreur)
- **Refresh token** : appel automatique à `POST /auth/refresh` avec `credentials: "include"` (cookie httpOnly), puis réessai de la requête avec le nouveau token

Le token d’accès est stocké **en mémoire** (variable JS), pas dans `localStorage`.

## Contexte d’authentification

`AuthContext` expose :

- État : `user`, `isInitializing`, `isLoading`, `error`
- Actions : `login`, `signup`, `logout`
- Vérification de session au chargement via `/auth/refresh`

Les routes admin sont enveloppées dans `ProtectedRoute` avec `allowedRoles={["admin", "editor"]}`.

## Configuration Biome

- Formatage : espaces, guillemets doubles
- Règles recommandées activées
- Organisation automatique des imports (`organizeImports`)

## Lien avec le backend

Le frontend attend une API REST documentée dans le [README du backend](https://github.com/Mattia-FR/SariBlogBack/blob/main/README.md). En développement, lancer le backend (ex. port 4242) puis :

```bash
npm run dev
```

L’app sera servie par Vite (souvent `http://localhost:5173`).

---

*Frontend du projet Sariblog — blog/portfolio CMS.*
