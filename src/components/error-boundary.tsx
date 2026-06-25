'use client';

/**
 * Generic React error boundary for the Talent Portal.
 *
 * Renders a friendly error card with the original message and stack trace,
 * plus a "Try again" button that resets the boundary's error state.
 */

import * as React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional fallback renderer; receives the caught error + reset callback. */
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.reset);
      }
      return <DefaultErrorCard error={error} onReset={this.reset} />;
    }

    return children;
  }
}

/* -------------------------------------------------------------------------- */
/*  Default error card                                                        */
/* -------------------------------------------------------------------------- */

function DefaultErrorCard({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div
      role="alert"
      className="flex min-h-[320px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred while rendering this view.'}
        </p>
      </div>

      {error.stack ? (
        <pre className="max-h-48 w-full max-w-2xl overflow-auto rounded-lg bg-muted/60 p-3 text-left text-xs text-muted-foreground">
          {error.stack}
        </pre>
      ) : null}

      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Try again
      </button>
    </div>
  );
}
