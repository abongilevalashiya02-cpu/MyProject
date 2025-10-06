import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }

    toast.error('Something went wrong. Our team has been notified.');
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, send to error tracking service (Sentry, LogRocket, etc.)
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      };
      
      // Example: Send to your monitoring service
      // await fetch('/api/error-tracking', {
      //   method: 'POST',
      //   body: JSON.stringify(errorReport)
      // });
      
      console.log('Error logged:', errorReport);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-bantu-orange/5 via-white to-bantu-yellow/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-2 border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-700">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-2">
                <p className="text-gray-600">
                  We apologize for the inconvenience. Our team has been automatically notified.
                </p>
                {this.state.errorId && (
                  <p className="text-sm text-gray-500">
                    Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{this.state.errorId}</code>
                  </p>
                )}
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-red-800 mb-2">Error Details (Dev Mode):</h4>
                  <pre className="text-xs text-red-700 overflow-auto">
                    {this.state.error.message}
                    {'\n'}
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={this.handleRetry}
                  className="bg-bantu-orange hover:bg-bantu-orange/90"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-bantu-orange text-bantu-orange"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;