# Tests Frontend - SariBlog2

Ce dossier contient tous les tests unitaires et d'intégration pour le frontend de SariBlog2.

## Structure des tests

```
src/test/
├── setup.ts                    # Configuration globale des tests
├── utils/
│   └── test-utils.tsx         # Utilitaires et helpers pour les tests
└── __tests__/
    ├── components/            # Tests des composants React
    ├── hooks/                # Tests des hooks personnalisés
    ├── contexts/             # Tests des contextes React
    ├── lib/                  # Tests des utilitaires et services
    ├── utils/                # Tests des fonctions utilitaires
    └── integration/          # Tests d'intégration
```

## Configuration

### Vitest
Les tests utilisent **Vitest** comme framework de test, configuré dans `vitest.config.ts`.

### React Testing Library
Pour tester les composants React, nous utilisons **React Testing Library** qui privilégie les tests basés sur le comportement utilisateur.

### Mocks
- **API** : L'API client est mockée pour tous les tests
- **localStorage/sessionStorage** : Mockés pour simuler le stockage local
- **React Router** : Mocké pour les tests de navigation
- **GSAP** : Mocké pour les animations
- **Lucide React** : Mocké pour les icônes

## Types de tests

### 1. Tests unitaires
- **Hooks** : Testent la logique métier des hooks personnalisés
- **Utilitaires** : Testent les fonctions pures
- **Contextes** : Testent la gestion d'état global

### 2. Tests de composants
- **Composants isolés** : Testent le rendu et l'interaction
- **Formulaires** : Testent la validation et la soumission
- **Navigation** : Testent les liens et la navigation

### 3. Tests d'intégration
- **Flux complets** : Testent les parcours utilisateur
- **API** : Testent l'intégration avec le backend
- **Authentification** : Testent le cycle complet d'auth

## Commandes de test

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests avec interface graphique
npm run test:ui
```

## Bonnes pratiques

### 1. Nommage des tests
```typescript
describe('ComponentName', () => {
  it('devrait faire quelque chose quand condition', () => {
    // test
  });
});
```

### 2. Structure des tests
```typescript
describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('devrait se connecter avec succès', async () => {
    // Arrange
    const credentials = { email: 'test@test.com', password: 'password' };
    mockApi.post.mockResolvedValue(mockApiResponse({ user: mockUser, token: 'token' }));

    // Act
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login(credentials);
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### 3. Mocks et données de test
```typescript
// Utiliser les données mockées fournies
import { mockUser, mockArticle, mockApiResponse } from '../utils/test-utils';

// Créer des mocks spécifiques si nécessaire
const mockApi = api as any;
mockApi.get.mockResolvedValue(mockApiResponse({ data: 'test' }));
```

### 4. Tests d'accessibilité
```typescript
it('devrait être accessible', () => {
  render(<Component />);
  
  const button = screen.getByRole('button', { name: /submit/i });
  expect(button).toBeInTheDocument();
  expect(button).not.toBeDisabled();
});
```

## Couverture de code

La couverture de code est configurée pour inclure :
- Tous les fichiers `.ts` et `.tsx` dans `src/`
- Exclure les fichiers de test et de configuration
- Exclure les fichiers de types TypeScript

Objectif : **> 80%** de couverture de code.

## Debugging des tests

### 1. Tests qui échouent
```typescript
// Utiliser screen.debug() pour voir le DOM
render(<Component />);
screen.debug();

// Utiliser waitFor pour les opérations asynchrones
await waitFor(() => {
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### 2. Mocks qui ne fonctionnent pas
```typescript
// Vérifier que les mocks sont bien configurés
expect(mockApi.get).toHaveBeenCalledWith('/expected-endpoint');

// Vérifier les appels avec des paramètres spécifiques
expect(mockApi.post).toHaveBeenCalledWith('/endpoint', expectedData, expectedConfig);
```

### 3. Tests d'intégration
```typescript
// Utiliser des wrappers pour les contextes
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
```

## Exemples de tests

### Test de hook
```typescript
describe('useAuth', () => {
  it('devrait se connecter avec succès', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Test de composant
```typescript
describe('ArticleCard', () => {
  it('devrait afficher les informations de l\'article', () => {
    render(<ArticleCard article={mockArticle} />);
    
    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.excerpt)).toBeInTheDocument();
  });
});
```

### Test d'intégration
```typescript
describe('Admin Flow', () => {
  it('devrait permettre la création d\'un article', async () => {
    render(
      <TestWrapper>
        <AdminPage />
      </TestWrapper>
    );
    
    await user.click(screen.getByText('Créer un article'));
    // ... test du flux complet
  });
});
```
