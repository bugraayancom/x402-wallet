import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // Log to error tracking service if available
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Send to Sentry or other error tracking service
      console.log('Sending error to tracking service...');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-center min-h-screen p-8 bg-background"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
              aria-hidden="true"
            />

            <h2 className="text-xl mb-4 font-semibold text-center">
              An unexpected error occurred
            </h2>

            <p className="text-sm text-muted-foreground mb-6 text-center">
              We're sorry for the inconvenience. Please try reloading the page.
            </p>

            <details className="w-full mb-6">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
                View error details
              </summary>
              <div className="p-4 w-full rounded bg-muted overflow-auto">
                <pre className="text-xs text-muted-foreground whitespace-break-spaces">
                  {this.state.error?.message}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </div>
            </details>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer transition-opacity",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Reload page to recover from error"
            >
              <RotateCcw size={16} aria-hidden="true" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
