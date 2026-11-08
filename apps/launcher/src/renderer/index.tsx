import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@officex/ui/src/global.css' // Import from UI package

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: '20px', backgroundColor: 'white' }}>{this.state.error?.toString()}<br/><pre>{this.state.error?.stack}</pre></div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
