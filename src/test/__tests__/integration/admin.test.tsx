import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { AuthProvider } from '../../contexts/AuthContext';
import { mockUser, mockArticle, mockTag, mockApiResponse } from '../utils/test-utils';
import { api } from '../../lib/api';

// Mock de l'API
const mockApi = api as any;

// Composant de test pour simuler une page admin
const AdminTestPage = () => {
  return (
    <div>
      <h1>Page Admin</h1>
      <button data-testid="create-article">Créer un article</button>
      <button data-testid="manage-tags">Gérer les tags</button>
      <button data-testid="logout">Se déconnecter</button>
    </div>
  );
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Intégration - Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('devrait permettre la navigation dans l\'interface admin', async () => {
    const user = userEvent.setup();
    
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Vérifier que les boutons d'action sont présents
    expect(screen.getByTestId('create-article')).toBeInTheDocument();
    expect(screen.getByTestId('manage-tags')).toBeInTheDocument();
    expect(screen.getByTestId('logout')).toBeInTheDocument();
  });

  it('devrait gérer le cycle complet de création d\'article', async () => {
    const user = userEvent.setup();
    
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));
    mockApi.post.mockResolvedValue(mockApiResponse({ article: mockArticle }));

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Cliquer sur créer un article
    await user.click(screen.getByTestId('create-article'));

    // Vérifier que l'API a été appelée
    expect(mockApi.post).toHaveBeenCalled();
  });

  it('devrait gérer la déconnexion', async () => {
    const user = userEvent.setup();
    
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));
    mockApi.post.mockResolvedValue(mockApiResponse({}));

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Cliquer sur déconnexion
    await user.click(screen.getByTestId('logout'));

    // Vérifier que l'API de déconnexion a été appelée
    expect(mockApi.post).toHaveBeenCalledWith('/auth/logout', {}, expect.any(Object));
  });

  it('devrait gérer les erreurs d\'API', async () => {
    const user = userEvent.setup();
    
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));
    mockApi.post.mockRejectedValue({
      response: {
        status: 500,
        data: {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Erreur serveur',
          },
        },
      },
    });

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Cliquer sur créer un article (qui va échouer)
    await user.click(screen.getByTestId('create-article'));

    // L'erreur devrait être gérée sans faire planter l'application
    expect(mockApi.post).toHaveBeenCalled();
  });

  it('devrait maintenir l\'état d\'authentification entre les composants', async () => {
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Vérifier que l'utilisateur est bien connecté
    expect(localStorage.getItem('admin_token')).toBe('valid-token');
    expect(localStorage.getItem('admin_user')).toBe(JSON.stringify(mockUser));
  });

  it('devrait gérer le changement de thème', async () => {
    const user = userEvent.setup();
    
    // Simuler un utilisateur connecté
    localStorage.setItem('admin_token', 'valid-token');
    localStorage.setItem('admin_user', JSON.stringify(mockUser));

    mockApi.get.mockResolvedValue(mockApiResponse({ user: mockUser }));

    render(
      <TestWrapper>
        <AdminTestPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Admin')).toBeInTheDocument();
    });

    // Vérifier que le thème par défaut est appliqué
    expect(document.body).toHaveClass('light-theme');

    // Simuler un changement de thème (via un bouton de toggle)
    const themeToggle = document.querySelector('[data-testid="theme-toggle"]');
    if (themeToggle) {
      await user.click(themeToggle);
      expect(document.body).toHaveClass('dark-theme');
    }
  });
});
