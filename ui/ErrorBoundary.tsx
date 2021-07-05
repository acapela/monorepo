import { Component, ReactNode } from "react";

interface Props {
  errorFallback: ReactNode;
  children: ReactNode;
}

interface State {
  error: unknown | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): State {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    if (this.state.error) {
      return <>{this.props.errorFallback}</>;
    }

    return this.props.children;
  }
}
