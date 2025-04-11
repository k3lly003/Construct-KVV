import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void; // Optional error logging callback
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can optionally log the error using the provided callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      // Fallback logging if no onError prop is provided
      console.error("Caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI passed as a prop
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;