import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  errorMessage: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected application error.',
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="page-card" role="alert">
          <h2>Something went wrong</h2>
          <p className="status status--error">
            We ran into an unexpected error: {this.state.errorMessage}
          </p>
          <div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={this.handleTryAgain}
            >
              Try Again
            </button>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
