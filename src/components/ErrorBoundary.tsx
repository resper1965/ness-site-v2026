import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-8 text-center">
          <div className="space-y-6 max-w-md p-8 rounded-[2.5rem] bg-surface-container-low border border-white/5 nebula-shadow">
            <h2 className="text-2xl font-display font-bold text-white lowercase">
              algo deu errado<span className="text-primary-container">.</span>
            </h2>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">
              Ocorreu um erro inesperado na renderização desta página. Por favor, tente recarregar o site.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-primary-container text-on-primary py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary-container/20"
            >
              recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
