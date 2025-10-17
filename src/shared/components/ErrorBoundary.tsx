import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * ErrorBoundary component catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI with the chrome silver glass morphism design system.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details to console (can be extended to send to error tracking service)
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error Info:", errorInfo);

    this.setState({
      errorInfo: errorInfo.componentStack || null,
    });

    // TODO: Send error to error tracking service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black" />

          {/* Chrome metallic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-sky-950/20 via-purple-950/30 to-amber-950/20" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

          {/* Error Content */}
          <div className="relative z-10 container mx-auto px-6 max-w-3xl">
            <div className="relative group">
              {/* Outer Glow Layer */}
              <div
                className="absolute -inset-1 rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-30 transition-smooth"
                style={{
                  background: "radial-gradient(ellipse, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
                }}
              />

              {/* Main Glass Container */}
              <div className="relative liquid-glass p-10 md:p-12 rounded-[2rem] shadow-glass-xl border-2 border-white/[0.15] backdrop-blur-3xl">
                {/* Inner Shine Overlay */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.15] via-transparent to-transparent pointer-events-none" />

                <div className="relative space-y-8">
                  {/* Error Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div
                        className="absolute inset-0 blur-2xl opacity-40"
                        style={{
                          background: "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)",
                        }}
                      />
                      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/30">
                        <svg
                          className="w-10 h-10 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient-holographic leading-tight">
                      Something Went Wrong
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground/90">
                      We encountered an unexpected error. Our team has been notified and is working to fix the issue.
                    </p>
                  </div>

                  {/* Error Details (Development Only) */}
                  {process.env.NODE_ENV === "development" && this.state.error && (
                    <div className="glass rounded-2xl p-6 border border-white/[0.15] space-y-4">
                      <h2 className="text-sm font-bold text-red-400 uppercase tracking-wide">
                        Error Details (Dev Only)
                      </h2>
                      <div className="space-y-2">
                        <p className="text-sm text-red-300 font-mono break-words">
                          {this.state.error.toString()}
                        </p>
                        {this.state.errorInfo && (
                          <details className="text-xs text-muted-foreground/70 font-mono">
                            <summary className="cursor-pointer hover:text-muted-foreground transition-colors">
                              Component Stack
                            </summary>
                            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                              {this.state.errorInfo}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={this.handleReset}
                      className="
                        relative px-8 py-6 text-base rounded-full font-bold
                        text-background
                        border-2 border-white/30
                        shadow-glow hover:shadow-glow hover:scale-[1.02] hover:border-white/40
                        active:scale-[0.98]
                        transition-all duration-500
                        before:content-[''] before:absolute before:inset-0 before:rounded-full
                        before:bg-gradient-to-b before:from-white/30 before:via-white/15 before:to-transparent
                        before:pointer-events-none
                        btn-holographic
                      "
                      aria-label="Try Again"
                    >
                      <span className="relative z-10">Try Again</span>
                    </Button>

                    <Button
                      onClick={this.handleReload}
                      variant="outline"
                      className="
                        px-8 py-6 text-base rounded-full font-semibold
                        glass border-2 border-white/[0.15]
                        hover:bg-white/[0.12] hover:border-white/[0.25] hover:scale-[1.02]
                        active:scale-[0.98]
                        transition-all duration-500
                      "
                      aria-label="Reload Page"
                    >
                      Reload Page
                    </Button>
                  </div>

                  {/* Support Link */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground/70">
                      Need help?{" "}
                      <a
                        href="mailto:support@tdstudios.com"
                        className="text-gradient-holographic hover:underline font-semibold"
                      >
                        Contact Support
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="mt-8 text-center">
              <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
                POWERED BY VERDE
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
