# SariBlog Frontend

Interface utilisateur moderne développée avec React 19 et TypeScript pour le blog artistique SariBlog.

## 🎯 Vue d'ensemble

SariBlog est une plateforme complète pour une illustratrice, combinant un blog d'articles artistiques et une galerie d'illustrations. Ce dépôt contient le **frontend** de l'application, une Single Page Application (SPA) construite avec React, offrant une expérience utilisateur fluide et moderne. L'application suit les principes de l'Atomic Design et utilise des hooks personnalisés pour la gestion des données.

### Fonctionnalités principales

- **Blog d'articles** : Publication d'articles sur les techniques artistiques, inspirations et processus créatifs
- **Galerie d'illustrations** : Portfolio visuel avec système de tags et filtrage
- **Page "À propos"** : Présentation personnalisable de l'artiste
- **Système de contact** : Formulaire de contact avec gestion des messages
- **Interface d'administration** : Panel admin complet pour la gestion du contenu
- **Authentification sécurisée** : Système de connexion avec JWT
- **Thème sombre/clair** : Interface adaptative selon les préférences utilisateur

## 🏗️ Architecture du projet

Ce projet fait partie d'une architecture **full-stack** :

- **Frontend** (ce dépôt) : React 19 + TypeScript + Vite
- **Backend** : Node.js + Express.js + MySQL (dépôt séparé)
- **Base de données** : MySQL avec relations many-to-many pour les tags

### Installation et démarrage

#### Prérequis
- **Node.js** (version 18+)
- **Backend SariBlog** en cours d'exécution (voir dépôt backend)

#### Installation
```bash
# Cloner le dépôt
git clone [URL_DU_REPO_FRONTEND]
cd SariBlogFront

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

> **Note** : Assurez-vous que le backend est en cours d'exécution sur `http://localhost:3000` pour que l'application fonctionne correctement.

## 🏗️ Architecture des composants

Le projet suit la méthodologie **Atomic Design** avec une organisation claire des composants :

```
src/components/
├── atoms/           # Composants de base réutilisables
│   ├── Image.tsx
│   ├── ScrollButton.tsx
│   ├── Tag.tsx
│   └── ThemeToggle.tsx
├── molecules/       # Combinaisons d'atomes
│   ├── AdminAboutForm.tsx
│   ├── AdminArticleCard.tsx
│   ├── AdminArticleForm.tsx
│   ├── AdminIllustrationCard.tsx
│   ├── AdminIllustrationForm.tsx
│   ├── AdminMessageCard.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminTagCard.tsx
│   ├── AdminTagForm.tsx
│   ├── ArticleCard.tsx
│   ├── ContactCTA.tsx
│   ├── Footer.tsx
│   ├── IllustrationCard.tsx
│   ├── Navbar.tsx
│   ├── Pagination.tsx
│   └── TagList.tsx
├── organisms/       # Sections complexes
│   ├── AboutPreview.tsx
│   ├── ArticlesPreview.tsx
│   ├── GalleryPreview.tsx
│   ├── Header.tsx
│   └── Hero.tsx
├── layouts/         # Layouts de page
│   └── AdminLayout.tsx
└── pages/           # Pages de l'application
    ├── About.tsx
    ├── ArticleDetail.tsx
    ├── Articles.tsx
    ├── Contact.tsx
    ├── Gallery.tsx
    ├── GalleryDetail.tsx
    ├── HomePage.tsx
    └── admin/        # Pages d'administration
        ├── AdminAbout.tsx
        ├── AdminArticles.tsx
        ├── AdminIllustrations.tsx
        ├── AdminLogin.tsx
        ├── AdminMessages.tsx
        └── AdminTags.tsx
```

### Structure des composants

#### 🧩 Atoms (Composants de base)
- **Image** : Composant d'image optimisé avec lazy loading
- **Tag** : Badge de tag avec styles cohérents
- **ThemeToggle** : Bouton de basculement thème sombre/clair
- **ScrollButton** : Bouton de retour en haut de page

#### 🔗 Molecules (Composants composites)
- **ArticleCard** : Carte d'article avec image, titre et extrait
- **IllustrationCard** : Carte d'illustration pour la galerie
- **Navbar** : Barre de navigation responsive
- **Footer** : Pied de page avec liens et informations
- **Pagination** : Composant de pagination réutilisable avec navigation complète
- **ContactCTA** : Call-to-action pour le formulaire de contact
- **TagList** : Liste de tags pour les articles
- **AdminSidebar** : Barre latérale d'administration
- **AdminArticleCard** : Carte d'article pour l'administration
- **AdminArticleForm** : Formulaire de création/édition d'articles
- **AdminIllustrationCard** : Carte d'illustration pour l'administration
- **AdminIllustrationForm** : Formulaire de création/édition d'illustrations
- **AdminMessageCard** : Carte de message pour l'administration
- **AdminTagCard** : Carte de tag pour l'administration
- **AdminTagForm** : Formulaire de création/édition de tags
- **AdminAboutForm** : Formulaire d'édition de la page "À propos"

#### 🏛️ Organisms (Sections complexes)
- **Header** : En-tête principal avec navigation
- **Hero** : Section héro de la page d'accueil avec bouton de scroll
- **ArticlesPreview** : Aperçu des derniers articles
- **GalleryPreview** : Carrousel d'aperçu de la galerie
- **AboutPreview** : Aperçu de la page "À propos"

#### 📄 Pages (Composants de page)
- **HomePage** : Page d'accueil avec hero, aperçus et CTA
- **Articles** : Page de liste des articles avec pagination
- **ArticleDetail** : Page de détail d'un article
- **Gallery** : Page de galerie avec grille d'illustrations
- **GalleryDetail** : Page de détail d'une illustration
- **About** : Page "À propos" de l'artiste
- **Contact** : Page de contact avec formulaire
- **AdminLogin** : Page de connexion administrateur
- **AdminArticles** : Gestion des articles (admin)
- **AdminIllustrations** : Gestion des illustrations (admin)
- **AdminMessages** : Gestion des messages (admin)
- **AdminTags** : Gestion des tags (admin)
- **AdminAbout** : Gestion de la page "À propos" (admin)

## 🎣 Hooks personnalisés

Le projet utilise des hooks personnalisés pour la gestion des données et la logique métier :

### Hooks de données
```typescript
// Gestion des articles
useArticles()           // Liste paginée des articles
useArticleBySlug()      // Article par slug
useLatestArticles()     // Derniers articles

// Gestion des illustrations
useIllustrations()      // Liste des illustrations
useIllustrationById()   // Illustration par ID
useGallery()           // Galerie avec pagination

// Gestion de la page "À propos"
useAbout()             // Données page "À propos"

// Gestion administrative
useAdminArticles()     // CRUD articles admin (liste)
useAdminArticle()      // Article admin spécifique
useAdminArticleTags()  // Tags des articles admin
useAdminIllustrations() // CRUD illustrations admin (liste)
useAdminIllustration() // Illustration admin spécifique
useAdminIllustrationTags() // Tags des illustrations admin
useAdminMessages()     // CRUD messages admin (liste)
useAdminMessage()      // Message admin spécifique
useAdminTags()         // CRUD tags admin (liste)
useAdminTag()          // Tag admin spécifique
useAdminAbout()        // Gestion page "À propos"
useAdminAboutHistory() // Historique de la page "À propos"
useAdminUpload()       // Upload de fichiers
```

### Hooks utilitaires
```typescript
useAuth()              // Authentification utilisateur
usePagination()        // Logique de pagination avec URL
useScroll()            // Gestion du scroll avec seuil
```

## 🎨 Contextes React

### AuthContext
Gestion de l'authentification et des permissions utilisateur :
```typescript
type AuthContextType = AuthState & {
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: { code: string; message: string };
  }>;
  logout: () => Promise<void>;
  hasRole: (role: string | string[]) => boolean;
};
```

### ThemeContext
Gestion du thème sombre/clair :
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}
```

## 📁 Structure des dossiers

```
src/
├── components/        # Composants React
│   ├── atoms/         # Composants de base
│   ├── molecules/     # Composants composites
│   ├── organisms/     # Sections complexes
│   ├── layouts/       # Layouts de page
│   └── pages/         # Pages de l'application
├── contexts/          # Contextes React
├── hooks/             # Hooks personnalisés
├── types/             # Définitions TypeScript
├── lib/               # Utilitaires et configuration
├── config/            # Configuration (SWR, etc.)
├── assets/            # Assets statiques
├── App.tsx            # Composant racine
├── App.css            # Styles globaux
└── main.tsx           # Point d'entrée
```

## 🎯 Types TypeScript

### Types principaux
```typescript
// Articles
export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  created_at: string;
  tags: string | null;
};

// Illustrations
export type Illustration = {
  id: number;
  title: string;
  image: string;
  alt_text: string;
  description?: string;
  created_at?: string;
};

// Authentification
export type User = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  last_login: string;
  created_at: string;
};

// Thème
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Types admin (dans src/types/admin/)
export type AdminArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  tags: Array<{ id: number; name: string }>;
};

export type AdminIllustration = {
  id: number;
  title: string;
  description: string | null;
  image: string;
  alt_text: string | null;
  is_in_gallery: boolean;
  created_at: string;
  tags: Array<{ id: number; name: string }>;
};

export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  sender_ip: string | null;
  created_at: string;
  is_read: boolean;
};

export type AdminTag = {
  id: number;
  name: string;
  slug: string;
};

export type AdminAbout = {
  id: number;
  content: string;
  image: string | null;
  updated_at: string;
};
```

## 🛠️ Technologies utilisées

### Core
- **React 19** - Framework UI avec les dernières fonctionnalités
- **TypeScript** - Typage statique pour une meilleure maintenabilité
- **Vite** - Build tool ultra-rapide

### Routing & Navigation
- **React Router DOM v7** - Routage côté client avec data loaders

### Gestion d'état & Données
- **SWR** - Cache intelligent et synchronisation des données
- **Axios** - Client HTTP pour les appels API

### Animations & UI
- **GSAP** - Animations performantes
- **Lucide React** - Icônes modernes et cohérentes

### Développement
- **Biome** - Linter et formateur de code ultra-rapide

## 🔗 Intégration avec le Backend

Ce frontend communique avec l'API REST du backend SariBlog via :

- **Base URL** : `http://localhost:3000` (développement)
- **Authentification** : JWT tokens stockés dans le localStorage
- **Gestion d'état** : SWR pour le cache et la synchronisation des données
- **Upload de fichiers** : Multer côté backend pour les images

### Endpoints utilisés
- `GET /api/articles` - Liste des articles
- `GET /api/illustrations` - Liste des illustrations
- `POST /api/auth/login` - Authentification
- `GET /api/auth/verify` - Vérification du token
- `POST /api/admin/*` - Opérations d'administration
- `POST /api/admin/upload/*` - Upload de fichiers
- `GET /api/about` - Données de la page "À propos"
- `POST /api/contact` - Envoi de messages de contact

### Configuration API
```typescript
// src/lib/api.ts
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);
```

## 🚀 Scripts de développement

```bash
# Développement
npm run dev          # Serveur de développement Vite
npm run build        # Build de production
npm run preview      # Aperçu du build de production

# Qualité du code
npm run lint         # Vérification avec Biome
npm run format       # Formatage automatique
npm run check        # Vérification avec Biome
```

## 🎨 Système de thèmes

L'application supporte les thèmes sombre et clair avec :
- **CSS Custom Properties** pour les variables de couleurs
- **Context React** pour la gestion de l'état du thème
- **Persistance** des préférences utilisateur
- **Transition fluide** entre les thèmes

## 📱 Responsive Design

- **Mobile First** : Design adaptatif depuis mobile
- **Breakpoints** : sm, md, lg, xl
- **Flexbox & Grid** : Layouts modernes et flexibles
- **Images responsives** : Optimisation automatique

## 🔧 Configuration

### Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
});
```

### SWR
```typescript
// config/swr.ts
export const swrConfig = {
  fetcher: (url: string) => api.get(url).then((res) => res.data),
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
```

## 🧪 Bonnes pratiques

### Composants
- **Composants fonctionnels** avec hooks
- **Props typées** avec TypeScript
- **Composition** plutôt qu'héritage
- **Séparation des responsabilités**

### Performance
- **Lazy loading** des images
- **Code splitting** avec React.lazy
- **Memoization** avec React.memo
- **Optimisation des re-renders**

### Accessibilité
- **HTML sémantique** [[memory:8650170]]
- **ARIA labels** appropriés
- **Navigation au clavier**
- **Contraste des couleurs**

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SariBlog
VITE_CONTACT_EMAIL=contact@example.com
```

> **Note** : `VITE_API_URL` doit pointer vers l'URL de base du backend (sans `/api`), car l'API ajoute automatiquement `/api` dans la configuration axios.

## 📚 Ressources utiles

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation SWR](https://swr.vercel.app/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

---

*Frontend développé avec React 19, TypeScript et Vite pour une expérience utilisateur optimale.*