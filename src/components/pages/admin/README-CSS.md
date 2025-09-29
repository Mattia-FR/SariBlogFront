# Structure CSS Admin - Guide de Référence

## Vue d'ensemble

Le système CSS admin a été refactorisé pour être harmonieux avec le design non-admin et éliminer les duplications de code.

## Architecture

### 1. AdminCommon.css - Styles de base
Contient tous les styles communs utilisés par toutes les pages admin :

- **`.admin-page`** : Layout de base pour toutes les pages
- **`.admin-page-header`** : En-tête standardisé
- **`.admin-button`** : Système de boutons unifié (primary, secondary, danger)
- **`.admin-stats`** : Système de statistiques avec hover effects
- **`.admin-grid`** : Système de grille harmonisé avec le design non-admin
- **`.admin-card`** : Cartes avec hover effects cohérents
- **`.admin-actions`** : Conteneur pour les actions de page
- **`.admin-loading`** / **`.admin-error`** : États de chargement et d'erreur

### 2. Fichiers spécifiques
Chaque page admin a son propre fichier CSS avec les classes nécessaires :

- **AdminLogin.css** : Styles spécifiques au formulaire de connexion
- **AdminAbout.css** : Styles pour la prévisualisation et l'historique About
- **AdminArticles.css** : Classes `.admin-articles-grid`
- **AdminUsers.css** : Classes `.admin-users-grid`, `.admin-users-stats`
- **AdminTags.css** : Classes `.admin-tags-grid`, `.admin-tags-stats`
- **AdminMessages.css** : Classes `.admin-messages-grid`, `.admin-messages-stats`, `.admin-messages-actions`
- **AdminIllustrations.css** : Classes `.admin-illustrations-grid`

## Classes à utiliser

### Layout de page
```html
<div className="admin-page">
  <header className="admin-page-header">
    <h1>Titre de la page</h1>
    <div className="admin-actions">
      <!-- Actions de page -->
    </div>
  </header>
</div>
```

### Statistiques
```html
<div className="admin-stats">
  <div className="stat-item active">
    <span className="stat-number">42</span>
    <span className="stat-label">Actifs</span>
  </div>
</div>
```

### Grille de contenu
```html
<div className="admin-grid">
  <div className="admin-card">
    <h3>Titre</h3>
    <p>Description</p>
    <div className="card-actions">
      <button className="admin-button primary">Action</button>
    </div>
  </div>
</div>
```

### Boutons
```html
<button className="admin-button primary">Bouton principal</button>
<button className="admin-button secondary">Bouton secondaire</button>
<button className="admin-button danger">Bouton danger</button>
```

## Harmonisation avec le design non-admin

- **Hover effects** : Même effet de scale et box-shadow que les cartes non-admin
- **Variables CSS** : Utilisation des mêmes variables de couleur et de police
- **Transitions** : Transitions cohérentes de 0.3s ease
- **Typographie** : Même système de polices (Cormorant Garamond + Inter)
- **Espacement** : Même système de clamp() pour la responsivité

## Avantages de cette structure

1. **DRY (Don't Repeat Yourself)** : Élimination des duplications de code
2. **Maintenabilité** : Un seul endroit pour modifier les styles communs
3. **Cohérence** : Design harmonieux entre admin et non-admin
4. **Performance** : Moins de CSS à charger
5. **Évolutivité** : Facile d'ajouter de nouvelles pages admin
