import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock de sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock de l'API
vi.mock('../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock des variables d'environnement
vi.mock('import.meta.env', () => ({
  VITE_API_URL: 'http://localhost:3000',
}));

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test' }),
    useParams: () => ({}),
  };
});

// Mock de SWR
vi.mock('swr', () => ({
  default: vi.fn(),
}));

// Mock de GSAP
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
    })),
  },
}));

// Mock de Lucide React
vi.mock('lucide-react', () => ({
  Menu: vi.fn(() => <div data-testid="menu-icon" />),
  X: vi.fn(() => <div data-testid="close-icon" />),
  Sun: vi.fn(() => <div data-testid="sun-icon" />),
  Moon: vi.fn(() => <div data-testid="moon-icon" />),
  ChevronUp: vi.fn(() => <div data-testid="chevron-up-icon" />),
  Mail: vi.fn(() => <div data-testid="mail-icon" />),
  Phone: vi.fn(() => <div data-testid="phone-icon" />),
  MapPin: vi.fn(() => <div data-testid="map-pin-icon" />),
  Plus: vi.fn(() => <div data-testid="plus-icon" />),
  Edit: vi.fn(() => <div data-testid="edit-icon" />),
  Trash2: vi.fn(() => <div data-testid="trash-icon" />),
  Eye: vi.fn(() => <div data-testid="eye-icon" />),
  Upload: vi.fn(() => <div data-testid="upload-icon" />),
  Check: vi.fn(() => <div data-testid="check-icon" />),
  XCircle: vi.fn(() => <div data-testid="x-circle-icon" />),
}));

// Supprimer les warnings de console pendant les tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
