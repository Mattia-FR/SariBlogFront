import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

// Wrapper personnalisé pour les tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

// Fonction de rendu personnalisée
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock des données de test
export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@test.com',
  role: 'admin',
  is_active: true,
  last_login: '2024-01-01T00:00:00.000Z',
  created_at: '2024-01-01T00:00:00.000Z',
};

export const mockArticle = {
  id: 1,
  title: 'Test Article',
  slug: 'test-article',
  excerpt: 'Test excerpt',
  content: 'Test content',
  image: 'test-image.jpg',
  status: 'published',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockTag = {
  id: 1,
  name: 'Test Tag',
  description: 'Test description',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

export const mockIllustration = {
  id: 1,
  title: 'Test Illustration',
  description: 'Test description',
  image: 'test-illustration.jpg',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

// Fonction pour simuler une réponse API réussie
export const mockApiResponse = <T>(data: T) => ({
  data: {
    success: true,
    data,
    message: 'Success',
  },
});

// Fonction pour simuler une erreur API
export const mockApiError = (status: number = 400, message: string = 'Error') => ({
  response: {
    status,
    data: {
      success: false,
      error: {
        code: 'API_ERROR',
        message,
      },
    },
  },
});

// Fonction pour simuler un token JWT valide
export const mockValidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MTUzNjAwfQ.test-signature';

// Fonction pour simuler un token JWT expiré
export const mockExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MDY3MjAwfQ.expired-signature';

// Fonction pour simuler des données de formulaire
export const mockFormData = {
  title: 'Test Title',
  excerpt: 'Test excerpt',
  content: 'Test content',
  image: 'test-image.jpg',
  status: 'published' as const,
  tagIds: [1, 2],
};

// Fonction pour simuler des données de pagination
export const mockPagination = {
  limit: 10,
  offset: 0,
  totalCount: 25,
  totalPages: 3,
};

// Fonction pour attendre qu'un élément soit dans le DOM
export const waitForElement = async (selector: string, timeout: number = 1000) => {
  const { getByTestId, getByText, getByRole } = await import('@testing-library/react');
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);

    const checkElement = () => {
      try {
        let element;
        if (selector.startsWith('data-testid=')) {
          element = getByTestId(selector.replace('data-testid=', ''));
        } else if (selector.startsWith('text=')) {
          element = getByText(selector.replace('text=', ''));
        } else if (selector.startsWith('role=')) {
          element = getByRole(selector.replace('role=', ''));
        } else {
          element = document.querySelector(selector);
        }
        
        if (element) {
          clearTimeout(timer);
          resolve(element);
        } else {
          setTimeout(checkElement, 10);
        }
      } catch (error) {
        setTimeout(checkElement, 10);
      }
    };

    checkElement();
  });
};

// Réexporter tout de @testing-library/react
export * from '@testing-library/react';
export { customRender as render };
