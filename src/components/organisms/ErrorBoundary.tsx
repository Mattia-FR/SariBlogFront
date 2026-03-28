import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "../pages/ErrorPage/ErrorPage.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erreur attrapée :", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="redirection-main">
          <h2>Oups !</h2>
          <p>
            Une erreur est survenue. Rechargez la page ou revenez à la{" "}
            <Link to="/">page d'accueil</Link>.
          </p>
          {import.meta.env.DEV && <pre>{this.state.error?.message}</pre>}
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
