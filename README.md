# Template React + TypeScript + Vite + Biome

Un template personnel minimaliste pour démarrer rapidement des projets React avec une configuration propre et moderne.

## 🚀 Démarrage rapide

```bash
# Cloner le template
git clone https://github.com/votre-username/mon-react-template.git nom-du-projet
cd nom-du-projet

# Nettoyer l'historique git et réinitialiser
rm -rf .git
git init

# Mettre à jour le nom du projet
npm pkg set name="nom-du-projet"

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🛠️ Stack technique

- **React** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Biome** - Linter et formatter (remplace ESLint + Prettier)

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Preview du build
npm run check    # Vérification du code (lecture seule)
npm run format   # Formatage automatique
npm run lint     # Linting + formatage + corrections
```

## 📁 Structure du projet

```
src/
├── App.tsx      # Composant principal (minimaliste)
├── App.css      # Styles du composant App
├── main.tsx     # Point d'entrée avec gestion d'erreur
└── index.css    # Reset CSS minimal
```

## ⚙️ Configuration

### Biome
Configuration dans `biome.json` :
- Formatage avec espaces et guillemets doubles
- Règles recommandées activées
- Organisation automatique des imports

### TypeScript
Configuration standard avec `tsconfig.json` pour Vite.

## 🎯 Philosophie du template

- **Minimaliste** - Juste l'essentiel pour commencer
- **Moderne** - Outils récents et bonnes pratiques
- **Propre** - Pas de CSS de démo, structure claire
- **Évolutif** - Base solide pour grandir

## 📚 Prochaines étapes suggérées

Selon vos besoins, vous pouvez ajouter :
- **State management** - Zustand, Redux Toolkit
- **UI Library** - Tailwind CSS, Material-UI
- **Testing** - Vitest, React Testing Library
- **API calls** - Axios, React Query

---

*Template créé pour mes projets personnels - n'hésitez pas à l'adapter selon vos besoins !*