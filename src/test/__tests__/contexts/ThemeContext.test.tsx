import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { mockUser } from "../utils/test-utils";

// Composant de test pour accéder au contexte
const TestComponent = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark">{isDark.toString()}</div>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("devrait fournir le thème par défaut (light)", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
  });

  it("devrait restaurer le thème depuis localStorage", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
  });

  it("devrait basculer entre les thèmes", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Vérifier l'état initial
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");

    // Basculer vers le thème sombre
    fireEvent.click(screen.getByTestId("toggle-button"));

    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("true");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

    // Basculer vers le thème clair
    fireEvent.click(screen.getByTestId("toggle-button"));

    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("devrait gérer les valeurs invalides dans localStorage", () => {
    localStorage.setItem("theme", "invalid-theme");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Devrait revenir au thème par défaut
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
    expect(screen.getByTestId("is-dark")).toHaveTextContent("false");
  });

  it("devrait appliquer la classe CSS appropriée au body", () => {
    const { container } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Vérifier que la classe est appliquée au body
    expect(document.body).toHaveClass("light-theme");

    // Basculer vers le thème sombre
    fireEvent.click(screen.getByTestId("toggle-button"));

    expect(document.body).toHaveClass("dark-theme");
    expect(document.body).not.toHaveClass("light-theme");
  });

  it("devrait nettoyer les classes CSS lors du démontage", () => {
    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Basculer vers le thème sombre
    fireEvent.click(screen.getByTestId("toggle-button"));
    expect(document.body).toHaveClass("dark-theme");

    // Démonter le composant
    unmount();

    // Les classes devraient être nettoyées
    expect(document.body).not.toHaveClass("dark-theme");
    expect(document.body).not.toHaveClass("light-theme");
  });

  it("devrait gérer les erreurs de localStorage", () => {
    // Simuler une erreur de localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error("localStorage error");
    });

    // Le composant ne devrait pas planter
    expect(() => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );
    }).not.toThrow();

    // Restaurer localStorage
    localStorage.setItem = originalSetItem;
  });

  it("devrait gérer les erreurs de localStorage lors du toggle", () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error("localStorage error");
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    // Le toggle ne devrait pas planter même en cas d'erreur localStorage
    expect(() => {
      fireEvent.click(screen.getByTestId("toggle-button"));
    }).not.toThrow();

    // Restaurer localStorage
    localStorage.setItem = originalSetItem;
  });
});
