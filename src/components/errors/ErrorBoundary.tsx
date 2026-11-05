import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

// React's native error-boundary lifecycle requires a class component.
// This approved exception avoids adding a dependency; other UI stays functional.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected application rendering error', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-8">
          <div role="alert">
            <h2 className="text-xl font-semibold">The fixture schedule cannot be displayed</h2>
            <p className="mt-2 text-muted-foreground">Please try reloading the page. If the issue persists, contact your administrator.</p>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
