import { useTheme } from "../../contexts/ThemeContext";
import "./ThemeToggle.css";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Basculer vers le mode ${theme === "light" ? "sombre" : "clair"}`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
