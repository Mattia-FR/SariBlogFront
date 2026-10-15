import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../../utils/logger";
import ErrorView from "../molecules/ErrorView";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Dernier filet, hors Router : couvre AuthProvider et l'initialisation du routeur.
// Les erreurs de pages sont gérées plus bas par l'errorElement de React Router.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorView
          status={null}
          inRouter={false}
          detail={this.state.error?.stack ?? this.state.error?.message}
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
