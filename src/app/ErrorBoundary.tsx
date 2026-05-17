import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button, Card } from '@core/ui';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void error;
    void errorInfo;
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Card className="mx-auto mt-10 max-w-2xl text-center">
          <h2 className="text-xl font-semibold">Ocurrió un error en esta sección</h2>
          <p className="mt-3 text-sm text-brand-muted">
            Puedes reiniciar la experiencia sin perder el resto de la aplicación.
          </p>
          <Button
            className="mt-5"
            onClick={() => window.location.assign('/')}
          >
            Reiniciar
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
