import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@officex/ui/src/global.css';

window.addEventListener('error', (e) => {
  console.error('[Global Error]', e.error || e.message);
  const overlay = document.getElementById('debug-overlay');
  if (overlay) {
    overlay.style.display = 'block';
    overlay.textContent = `[Error]: ${e.message}\n${e.error?.stack || ''}`;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Rejection]', e.reason);
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('[React ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#ef4444', background: '#0f172a', height: '100vh', fontFamily: 'monospace' }}>
          <h2>⚠️ Runtime Render Error in Workplace PowerPoint</h2>
          <pre style={{ background: '#1e293b', padding: 20, borderRadius: 8, color: '#f8fafc', overflow: 'auto', marginTop: 20 }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button 
            style={{ marginTop: 20, padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            onClick={() => window.location.reload()}
          >
            Tải lại trang (Reload)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
