# Audit Modern Web Guidance — Sariblog

**Date :** 20 novembre 2026  
**Périmètre :** application front [`Front/src`](Front/src) et [`Front/index.html`](Front/index.html) ; notes connexes côté API [`Back/`](Back/) quand elles impactent le client.  
**Méthode :** skill [Modern Web Guidance](Front/.agents/skills/modern-web-guidance/SKILL.md) — `legacy-scan` + recherches/retrieval de guides thématiques.  
**Statut :** rapport d’observations et de recommandations ; les items marqués **traité** ont été corrigés dans le code.

---

## 1. Résumé exécutif

Sariblog Front est une SPA **déjà orientée plateforme moderne** : React 19, Vite 7, React Router 7 (loaders), TypeScript, `fetch` natif, auth JWT en mémoire + cookie refresh HttpOnly, CSS progressif (nesting, `:has()`, `color-mix()`, couleurs relatives).

Les écarts importants par rapport aux guides Modern Web ne sont **pas** du legacy massif (jQuery, XHR, etc.), mais des **patterns custom qui réinventent des APIs natives** et des **manquements Core Web Vitals / a11y** :

1. ~~Modale custom au lieu de `<dialog>`~~ — **traité**
2. ~~Image hero sans priorisation LCP (`fetchpriority`)~~ — **traité**
3. ~~Polices Google chargées via `@import` CSS (bloquant)~~ — **traité** (self-host woff2)
4. Autocomplete login incomplet sur l’identifiant
5. Absence de politique navigateur / browserslist documentée
6. Quelques détails CSS (~~`cqi` sans conteneur~~ — **traité** ; ~~`.sr-only` legacy~~ — **traité** ; ~~`prefers-reduced-motion`~~ — **traité**)

Le scan automatique `legacy-scan` ne remonte que **3 occurrences** mineures (copie + `.sort()`), et encore sous réserve du `target` TypeScript ES2022.

---

## 2. Méthodologie et sources

### 2.1 Commandes exécutées

```bash
# Depuis Front/
npx -y modern-web-guidance@latest legacy-scan src --json
npx -y modern-web-guidance@latest search "<requête>" --skill-version 2026_11_10-47b4c80e
npx -y modern-web-guidance@latest retrieve "<ids>"
```

### 2.2 Guides consultés

| ID | Thème |
|----|--------|
| `dialog` | Modales natives, focus, light-dismiss, fallbacks |
| `optimize-image-priority` | `fetchpriority`, LCP, lazy loading |
| `autofill-sign-in-form` | `autocomplete` login / password |
| `visually-stable-font-fallbacks` | `font-size-adjust`, CLS polices |
| `same-document-transitions` | View Transitions SPA |
| `js` | Méthodes tableaux immuables (`toSorted`, etc.) |
| `performance` | Hints réseau, CWV, preload/preconnect |
| `accessibility` | Sémantique, focus, formulaires |
| `forms` | Formulaires accessibles et sécurisés |
| `html` | Sémantique HTML, overlays natifs, priorisation ressources |
| `motion` | Animations, `prefers-reduced-motion` |
| `security` | CSP, cookies, sinks DOM |
| `defer-rendering-heavy-content` | `content-visibility` |
| `secure-external-subresources` | SRI / CORS / referrer sur assets tiers |

### 2.3 Limite du `legacy-scan`

Le scan ne couvre qu’environ **20 %** du corpus (règles déterministes). Un résultat « 3 findings » **ne signifie pas** que le reste est conforme : les écarts dialog / images / fonts / a11y viennent des guides thématiques, pas du scan.

---

## 3. Stack et architecture observées

| Couche | Choix |
|--------|--------|
| UI | React 19 |
| Routing | React Router DOM 7 (`createBrowserRouter`, loaders, `errorElement`) |
| Build | Vite 7, plugin React |
| Langage | TypeScript (`target` / `lib` **ES2022**) |
| Validation | Zod |
| CSS | Fichiers `.css` colocalisés ; pas de Tailwind / PostCSS / Sass |
| Lint | Biome |
| Tests | Vitest |
| API | Express 5 (Back), CORS + credentials, Multer + Sharp |

**Point d’entrée :** `index.html` → `src/main.tsx` → `AuthProvider` → `RouterProvider`.

**Auth client :** access token en mémoire module ; refresh via cookie + `POST /auth/refresh` ; header `Authorization: Bearer` ; `credentials: "include"` sur toutes les requêtes ([`Front/src/utils/apiClient.ts`](Front/src/utils/apiClient.ts)).

**Auth serveur (pertinent pour le front) :** cookie refresh `httpOnly`, `secure: true`, `sameSite: "strict"` ; Helmet/CSP sur les réponses API uniquement (pas sur la SPA Vite).

---

## 4. APIs et pratiques Web déjà pertinentes

### 4.1 Réseau et session

- **`fetch`** unique couche HTTP (pas de `XMLHttpRequest`).
- **`credentials: "include"`** pour le cookie de refresh cross-origin.
- Refresh **single-flight** + retry après 401 (hors routes `/auth/`).
- **Pas de `localStorage` / `sessionStorage`** pour les tokens (choix explicite et aligné sécurité).
- Pas d’accès JS à `document.cookie`.

### 4.2 Formulaires et fichiers

- `FormData` pour login, contact, admin, uploads.
- `URL.createObjectURL` / révocation pour previews admin.
- Contraintes MIME / taille côté client (`imageConstraints.ts`), validation magic bytes + Sharp WebP côté back.

### 4.3 CSS moderne déjà utilisé

- Variables CSS, `clamp()`, media queries, nesting (`&`).
- **`:has()`** (radios catégories, tags, admin).
- **`color-mix()`** (nombreux écrans admin / contact).
- **Couleurs relatives** `rgb(from var(...) r g b / α)` (`index.css`, Hero).
- **`scroll-snap`** sur previews galerie / articles.
- **`:focus-visible`** largement présent en admin.
- `object-fit`, `aspect-ratio` sur médias.

### 4.4 Images (partiel)

- `loading="lazy"` sur cartes liste (`ImageCard`, `ArticleCard`).
- Fallback `thumbUrl` → `imageUrl` au `onError`.
- Formats upload acceptés modernes (WebP, AVIF, etc.).

### 4.5 Accessibilité (partiel positif)

- `useId`, `aria-invalid`, `aria-describedby` sur le login.
- `aria-labelledby` sur sections (hero, etc.).
- `autocomplete="current-password"` déjà présent sur le mot de passe.
- Toggle œil du mot de passe avec `aria-label`.

### 4.6 Ce qui n’est pas (et n’a pas besoin d’être) legacy

Non trouvé dans `Front/src` : jQuery, `document.write`, XHR synchrone, `$.ajax`, `innerHTML` / `dangerouslySetInnerHTML`, préfixes vendor massifs, Service Worker / PWA (absence = choix produit, pas « obsolète »).

---

## 5. Résultats `legacy-scan` (détaillés)

```json
{
  "totalFindings": 3,
  "ruleId": "js/copying-array-methods",
  "summary": "Remplacer [...arr].sort() par arr.toSorted()"
}
```

| Fichier | Ligne (approx.) | Pattern actuel | Correctif conseillé |
|---------|-----------------|----------------|---------------------|
| `Front/src/components/pages/Admin/Images/ImageCreate.tsx` | ~43 | `[...categoriesData].sort(...)` | `.toSorted(...)` |
| `Front/src/components/pages/Admin/Images/ImageEdit.tsx` | ~40 | idem | idem |
| `Front/src/components/pages/GalleryPage/GalleryHubPage.tsx` | ~7 | `[...categories].sort(...)` | `.toSorted(...)` |

### Rubrique keepWhen / dropWhen

Le guide `js` recommande `toSorted()` (Baseline / ES2023).  
Le **`tsconfig.app.json` cible ES2022** : selon la rubrique `dropWhen` du scan (« target older than ES2023 »), ces findings peuvent être **conservés tels quels** tant que la cible TS n’est pas montée.

**Conseil :**

1. Documenter une politique navigateur « modernes / Baseline ».
2. Passer `compilerOptions.target` et `lib` à **ES2023** (cohérent avec Vite et l’absence de browserslist legacy).
3. Remplacer alors les trois `[...].sort()` par `.toSorted()`.

Sans bump ES2023, laisser `[...].sort()` est acceptable (copie défensive + mutation locale).

---

## 6. Écarts majeurs hors scan (observations détaillées)

### 6.1 Modale custom — criticité haute (a11y / UX plateforme) — **traité**

**Fichiers :** [`Front/src/components/molecules/Modal.tsx`](Front/src/components/molecules/Modal.tsx), [`Front/src/components/molecules/Modal.css`](Front/src/components/molecules/Modal.css), consommateurs `ArticlePage` / `GalleryPage`

**Guides :** `dialog`, `light-dismiss-a-dialog`, `prevent-page-scroll-under-modal-dialog`, `accessibility`, `html`.

**Fait :**

- Markup natif `<dialog>` ouvert via `showModal()` / fermé via `close()` synchronisé avec `isOpen`.
- Nom accessible : prop `ariaLabel` (lightbox / commentaires).
- Bouton fermer : `type="button"` + `aria-label="Fermer"`.
- Light-dismiss : `closedby="any"` + fallback pointeur hors boîte si `closedBy` absent (Safari).
- CSS : `dialog.modal:modal { overscroll-behavior: contain }` et `::backdrop` avec `overflow: hidden` + `overscroll-behavior: contain`.
- Plus de portal custom, plus de `overflow: hidden` sur `body`, plus de `role="dialog"` / trap Escape manuels.

**Compatibilité navigateur :**

| Feature | Statut | Impact |
|---------|--------|--------|
| `<dialog>` + `showModal()` | Baseline Widely available | En prod |
| `closedby` | Limited (pas Safari au moment de l’audit) | Fallback pointeur hors boîte en place |
| Invoker Commands (`command` / `commandfor`) | Newly available (fin 2025) | Non utilisés — ouverture impérative React |
| `overscroll-behavior` sur backdrop | Support incomplet selon guide | Progressive enhancement ; pas de lock `body` |

---

### 6.2 Priorité image LCP (Hero) — criticité haute (performance) — **traité**

**Fichiers :** [`Front/src/components/organisms/Hero.tsx`](Front/src/components/organisms/Hero.tsx), [`Front/src/components/molecules/Footer.tsx`](Front/src/components/molecules/Footer.tsx)

**Guide :** `optimize-image-priority`.

**Fait :**

- Hero (candidat LCP) : `fetchPriority="high"`, sans `loading="lazy"`.
- Une seule image `high` sur la homepage.
- Footer icône Instagram hover (révélée à l’interaction) : `fetchPriority="low"` + `loading="lazy"` ; icône normale : `lazy` seul.
- Listes (`ImageCard` / `ArticleCard`) : inchangées — `loading="lazy"` sans `fetchPriority` (below-the-fold ; pas de `low` sur ces images).
- CLS : s’appuie sur `aspect-ratio` CSS du Hero (pas de `width`/`height` HTML sans métadonnées API).

**Reporté (hors lot) :**

- Exposer dimensions (`width`/`height`) via API/Sharp + attributs HTML.
- `srcset` / `sizes` pour listes et pages article.

**Compat :** `fetchpriority` = Newly available (Baseline depuis 2024-10-29) — attribut ignoré si non supporté (progressive enhancement).

---

### 6.3 Chargement des polices — criticité haute (performance / CLS) — **traité**

**Fichiers :** [`Front/src/index.css`](Front/src/index.css), [`Front/src/assets/fonts/`](Front/src/assets/fonts/), [`Back/src/config/helmet.ts`](Back/src/config/helmet.ts)

**Guides :** `performance`, `visually-stable-font-fallbacks`, `html`, `secure-external-subresources`.

**Fait :**

- Suppression du `@import` Google Fonts.
- Self-host woff2 + `@font-face` locaux (`font-display: swap`) dans [`fonts.css`](Front/src/assets/fonts/fonts.css) :
  - Manrope latin : 300, 400, 500, 600, 700
  - Merriweather latin : 400, 400 italic, 700, 700 italic
- `font-size-adjust: from-font;` sur `body` et titres (`h1`–`h3`).
- CSP Helmet : retrait de `fonts.googleapis.com` / `fonts.gstatic.com` (`styleSrc` / `fontSrc` → `'self'` uniquement).
- Plus de `preconnect` Google nécessaire (pas de dépendance runtime tierce pour les polices).

**Reporté (hors lot) :** meta document (`description`, `theme-color`, `color-scheme`) — voir P2 #12.

**Compat :** `font-size-adjust` Newly available (Baseline depuis 2024-07-25) — ignoré sinon.

---

### 6.4 Formulaire de connexion — criticité moyenne (UX / password managers)

**Fichier :** [`Front/src/components/molecules/LoginForm.tsx`](Front/src/components/molecules/LoginForm.tsx)

**Constat :**

- Mot de passe : `autoComplete="current-password"` — **conforme**.
- Identifiant : `name="identifier"`, `type="text"`, **sans** `autocomplete="username"`.
- Messages d’erreur : pas de `role="alert"` (annonce lecteur d’écran moins fiable).
- Labels `sr-only` présents — bon.

**Guide :** `autofill-sign-in-form`, `forms`, `accessibility`.

**Correctifs conseillés :**

1. Sur l’input identifiant : `autoComplete="username"` (même si le champ accepte email **ou** username — les password managers reconnaissent `username`).
2. Optionnel si l’usage dominant est l’email : `type="email"` + `inputMode="email"` **seulement** si le produit n’accepte plus un username non-email ; sinon rester en `type="text"` + `autocomplete="username"`.
3. Sur les paragraphes d’erreur globaux / champs : `role="alert"` (ou live region équivalente).
4. Conserver `name` / `id` stables (aujourd’hui `useId()` pour les `id` — acceptable pour a11y ; les password managers s’appuient surtout sur `autocomplete` + `name` dans un `<form>` avec submit).

**Hors scope immédiat mais listé par les guides auth :** passkeys (`passkey-authentication`) — utile pour un admin récurrent, pas prioritaire pour un blog public.

---

### 6.5 Unités `cqi` sans conteneur — criticité moyenne (CSS / layout) — **traité**

**Fichiers :** [`Front/src/components/organisms/Header.css`](Front/src/components/organisms/Header.css), [`Front/src/components/molecules/Footer.css`](Front/src/components/molecules/Footer.css)

**Fait :**

- Plus de `cqi` sans ancêtre container.
- Header logo : `margin-left: clamp(0.5rem, 2vw, 2rem)`.
- Footer : `padding: 3rem clamp(0.5rem, 2vw, 3rem)`.

---

### 6.6 `.sr-only` legacy — criticité basse — **traité**

**Fichier :** [`Front/src/index.css`](Front/src/index.css)

**Fait :**

- Remplacé `clip: rect(0, 0, 0, 0)` par `clip-path: inset(50%)`.
- Autres propriétés sr-only inchangées (comportement visible identique).

---

### 6.7 Motion / `prefers-reduced-motion` — criticité moyenne (a11y) — **traité**

**Fichiers :** Header, GalleryPreview, ArticlesPreview, BlogPage, GalleryPage, ArticlePage, ArticlesAdmin, ImagesAdmin (CSS).

**Fait :**

- Mouvements spatiaux (`transform` scale/rotate, underline width/left, scroll-snap) en **opt-in** via `@media (prefers-reduced-motion: no-preference)`.
- Pas de `animation-duration: 0.01ms` global.
- Transitions non spatiales (couleur, background, opacity, filter, box-shadow) conservées hors media query.
- Pas de carrousel auto-défile : WCAG 2.2.2 Pause/Stop non applicable aux previews scroll-snap manuels.

---

### 6.8 Listes longues / rendu — criticité moyenne (performance)

**Guides :** `defer-rendering-heavy-content`, `performance`.

**Constat :** pages blog / galerie / admin listent potentiellement beaucoup de cartes sans `content-visibility`.

**Correctifs conseillés :**

1. Sur les items **hors premier viewport** : `content-visibility: auto` + **`contain-intrinsic-size`** (obligatoire pour éviter collapse à 0 et sauts de scrollbar).
2. Ne pas appliquer sur le fold initial (hero, premières cartes).
3. Vérifier la navigation clavier / AT après activation (le guide exige un test de reachability).

**Compat :** Newly available (Baseline depuis 2025-09-15) — ignoré si non supporté.

---

### 6.9 Annulation des requêtes (`AbortSignal`) — criticité moyenne (robustesse)

**Fichier :** [`Front/src/utils/apiClient.ts`](Front/src/utils/apiClient.ts)

**Constat :** `AbortError` est déjà traité s’il survient, mais les appels / loaders ne propagent pas systématiquement un `AbortSignal` lié à la navigation ou au démontage.

**Correctifs conseillés :**

1. Accepter / forward `signal` dans les options `RequestInit` (déjà possible via `...options` — s’assurer que loaders et effets le passent).
2. Dans les loaders React Router : utiliser le signal fourni par le framework si disponible, ou un `AbortController` couplé au cycle de vie.
3. Dans les `useEffect` de fetch admin : abort au cleanup.

---

### 6.10 Document HTML / SEO / sécurité front — criticité moyenne à basse

**Fichier :** [`Front/index.html`](Front/index.html)

**Constat :**

- `lang="fr"`, charset, viewport, favicon, titre — OK de base.
- Manque : description, Open Graph (articles), `color-scheme`, éventuel `theme-color`.
- CSP / headers de sécurité : présents via Helmet **sur l’API**, pas sur la SPA servie séparément.
- Pas de PWA (manifest / SW) — acceptable pour un blog vitrine + admin.

**Guides :** `html`, `security`, `performance`.

**Correctifs conseillés :**

1. Meta description (statique ou injectée par route).
2. `color-scheme: light` (ou light/dark si thème prévu) pour aligner contrôles natifs.
3. Au reverse-proxy / hébergeur de la SPA : CSP en **Report-Only** d’abord, puis enforce ; `frame-ancestors` ; pas de duplication confuse avec la CSP API.
4. View Transitions same-document (`document.startViewTransition` autour des navigations RR) en polish UX — Newly available (Baseline depuis 2025-10-14), avec feature-detect.

---

### 6.11 Divers mineurs observés

| Observation | Conseil |
|-------------|---------|
| Classes style Tailwind dans `ProtectedRoute` (`flex items-center…`) sans Tailwind | Remplacer par CSS du design system ou retirer (classes sans effet) |
| Fichiers `*.css.bak` dans l’arbre | Nettoyer du repo si obsolètes |
| Unités / préfixe `-webkit-column-break-inside` (galerie) | Garder si nécessaire pour colonnes ; documenter |
| Cookie refresh `secure: true` même en dev | OK en général sur localhost ; surveiller les environnements HTTP non-TLS |
| Préfixes cookie `__Host-` / `__Secure-` absents | Renforcement optionnel côté Back |
| Contenu article en texte / `<p>` | Pas de sanitization HTML riche aujourd’hui (positif XSS) ; si rich text plus tard → guide `sanitize-untrusted-html` / Trusted Types |

---

## 7. Tableau de compatibilité navigateur

Politique **conseillée** à documenter (ex. `AGENTS.md`) :

> Baseline **Widely available** : usage libre.  
> Baseline **Newly available** : autorisé avec dégradation gracieuse (attributs/CSS ignorés).  
> **Pas de polyfills** sauf détection conditionnelle exigée par un guide.  
> Pas de support IE / navigateurs pré-Baseline.

| Feature | Usage actuel / proposé | Baseline / dispo | Fallback conseillé |
|---------|------------------------|------------------|--------------------|
| `fetch` + credentials | En prod | Widely | — |
| CSS nesting, `:has()`, `color-mix()` | En prod | Widely / Newly | Couleurs plates / sélecteurs plus verbeux |
| Relative colors `rgb(from …)` | En prod | Newly | Ombre / alpha fixe |
| `loading="lazy"` | Listes | Widely | — |
| `fetchpriority` | En prod (Hero) | Newly (2024-10) | Ignoré = heuristique navigateur |
| `<dialog>` / `showModal()` | En prod (Modal) | Widely | — |
| `closedby` | En prod + fallback Safari | Limited | Fallback pointeur hors dialog |
| `font-size-adjust` | À ajouter | Newly (2024-07) | CLS possible au swap |
| `toSorted` | Après bump ES2023 | ES2023 | Garder `[...].sort` si ES2022 |
| `content-visibility` | Listes longues | Newly (2025-09) | Ignoré |
| View Transitions | Optionnel SPA | Newly (2025-10) | Feature-detect, pas d’anim |
| Popover / Invoker Commands | Non utilisés | Newly | N/A tant que non adoptés |
| Pas de browserslist | Cible implicite « récents » | — | Documenter explicitement |

**Note :** l’absence de `browserslist` / Autoprefixer / polyfills est cohérente avec une cible moderne, **à condition** de l’écrire noir sur blanc pour éviter des régressions futures (ex. quelqu’un qui « modernise » vers `toSorted` sans monter `lib`).

---

## 8. Correctifs recommandés — feuille de route

### Priorité P0 (fort impact, effort modéré)

| # | Correctif | Fichiers principaux |
|---|-----------|---------------------|
| 1 | Migrer `Modal` vers `<dialog>` + `showModal` / CSS backdrop — **traité** | `Modal.tsx`, `Modal.css`, pages Article / Gallery |
| 2 | `fetchpriority="high"` sur l’image Hero ; dimensions si dispo — **traité** (dimensions reportées) | `Hero.tsx`, éventuellement type/API Image |
| 3 | Self-host fonts woff2 + `@font-face` ; `font-size-adjust` — **traité** | `fonts.css`, `index.css`, `helmet.ts` |
| 4 | `autocomplete="username"` + `role="alert"` sur erreurs login | `LoginForm.tsx` |
| 5 | Documenter politique navigateur ; bump TS ES2023 ; `toSorted` ×3 | `tsconfig.app.json`, 3 fichiers du scan |

### Priorité P1 (qualité / robustesse)

| # | Correctif | Fichiers principaux |
|---|-----------|---------------------|
| 6 | Corriger `cqi` (conteneur ou remplacement) — **traité** (`clamp` + `vw`) | `Header.css`, `Footer.css` |
| 7 | Moderniser `.sr-only` — **traité** (`clip-path: inset(50%)`) | `index.css` |
| 8 | Encadrer animations spatiales avec `prefers-reduced-motion` — **traité** (opt-in `no-preference`) | Header, previews, blog/galerie/article, admin listes |
| 9 | Propager `AbortSignal` loaders / effets → `apiClient` | `apiClient.ts`, loaders, pages admin |
| 10 | `content-visibility: auto` + `contain-intrinsic-size` hors fold | Listes blog / galerie / admin |

### Priorité P2 (polish plateforme)

| # | Correctif | Notes |
|---|-----------|--------|
| 11 | View Transitions same-document (RR) | Feature-detect ; guide `same-document-transitions` |
| 12 | Meta document + CSP Report-Only sur l’hébergement SPA | Ne pas confondre avec Helmet API |
| 13 | ~~Self-host fonts~~ — **traité** (P0 #3) ; SRI si assets externes figés restants | Sécurité supply-chain |
| 14 | Passkeys admin (optionnel) | Guide `passkey-authentication` |
| 15 | Nettoyage `*.css.bak`, classes Tailwind orphelines | Hygiène repo |

### Vérifications après éventuelle implémentation

- Relancer `npx modern-web-guidance@latest legacy-scan src --json` (attendu : 0 finding `toSorted` après migration ES2023).
- Test manuel modales : Escape, clic dehors, retour de focus, scroll page derrière.
- Lighthouse / Performance panel : LCP hero, CLS polices.
- Navigation clavier + lecteur d’écran sur login et lightbox.

---

## 9. Ce qu’il ne faut pas « moderniser » sans besoin

- **Réintroduire `localStorage` pour le JWT** — régression sécurité ; le modèle mémoire + cookie HttpOnly est le bon.
- **Polyfills blanket** (`core-js`, Autoprefixer massif) — contredit la cible moderne actuelle.
- **PWA / Service Worker** — seulement si offline / install sont des objectifs produit.
- **Remplacer React Router par View Transitions cross-document** — la SPA est same-document ; le guide adapté est `same-document-transitions`.
- **Ajouter `role="dialog"` sur le `<dialog>` natif** — le guide l’interdit (doublon / risque) ; déjà respecté dans `Modal`.

---

## 10. Références rapides fichiers clés

| Rôle | Chemin |
|------|--------|
| Skill Modern Web | `Front/.agents/skills/modern-web-guidance/SKILL.md` |
| Entrée HTML | `Front/index.html` |
| CSS global / fonts | `Front/src/index.css` |
| Client HTTP | `Front/src/utils/apiClient.ts` |
| Modale | `Front/src/components/molecules/Modal.tsx` |
| Hero | `Front/src/components/organisms/Hero.tsx` |
| Login | `Front/src/components/molecules/LoginForm.tsx` |
| TS config app | `Front/tsconfig.app.json` |
| CORS / Helmet (Back) | `Back/src/app.ts`, `Back/src/config/helmet.ts` |
| Cookies auth (Back) | `Back/src/controller/authController.ts` |

---

## 11. Disclosure Modern Web Guidance

Analyse réalisée avec `modern-web-guidance` (`legacy-scan` + `search` / `retrieve`). Les recommandations ci-dessus s’appuient sur les guides listés en §2.2 ; le scan automatique seul sous-estime les écarts dialog, images, fonts et a11y, d’où le croisement manuel avec le code applicatif.
