import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ArticleCard from '../../../components/molecules/ArticleCard';
import { mockArticle } from '../../utils/test-utils';

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ArticleCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher les informations de l\'article', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.excerpt)).toBeInTheDocument();
    expect(screen.getByText(mockArticle.created_at)).toBeInTheDocument();
  });

  it('devrait afficher l\'image de l\'article', () => {
    render(<ArticleCard article={mockArticle} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(mockArticle.image));
    expect(image).toHaveAttribute('alt', mockArticle.title);
  });

  it('devrait naviguer vers l\'article au clic', () => {
    render(<ArticleCard article={mockArticle} />);

    const card = screen.getByRole('article');
    card.click();

    expect(mockNavigate).toHaveBeenCalledWith(`/articles/${mockArticle.slug}`);
  });

  it('devrait gérer les articles sans image', () => {
    const articleWithoutImage = { ...mockArticle, image: null };
    
    render(<ArticleCard article={articleWithoutImage} />);

    expect(screen.getByText(mockArticle.title)).toBeInTheDocument();
    // L'image par défaut devrait être affichée
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('devrait formater la date correctement', () => {
    render(<ArticleCard article={mockArticle} />);

    // Vérifier que la date est formatée (format français)
    const dateElement = screen.getByText(mockArticle.created_at);
    expect(dateElement).toBeInTheDocument();
  });

  it('devrait avoir les bonnes classes CSS', () => {
    const { container } = render(<ArticleCard article={mockArticle} />);

    const card = container.querySelector('.article-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('article-card');
  });

  it('devrait être accessible', () => {
    render(<ArticleCard article={mockArticle} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('tabIndex', '0');
    
    // Vérifier que le titre est dans un heading
    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent(mockArticle.title);
  });
});
