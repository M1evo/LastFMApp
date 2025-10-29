import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary для перехвата ошибок React компонентов
 * Предотвращает падение всего приложения при ошибке в дочерних компонентах
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  /**
   * Сбрасывает состояние ошибки для повторной попытки
   */
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-message">Something went wrong</p>
          <p className="error-hint">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button onClick={this.handleReset} className="error-retry-button">
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}