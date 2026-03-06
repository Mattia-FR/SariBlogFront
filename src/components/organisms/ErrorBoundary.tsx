import { Component, type ErrorInfo, type ReactNode } from "react";

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
        <div>
          <h1>Une erreur est survenue. Rechargez la page.</h1>
          {import.meta.env.DEV && <pre>{this.state.error?.message}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
