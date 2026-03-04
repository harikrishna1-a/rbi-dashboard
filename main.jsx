import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../styles.css';

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'sans-serif',
            maxWidth: 640,
            margin: '24px auto',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
          }}
        >
          <h1 style={{ color: '#b91c1c', marginTop: 0 }}>Something went wrong</h1>
          <pre style={{ overflow: 'auto', fontSize: 12 }}>
            {this.state.error?.message ?? String(this.state.error)}
          </pre>
          <p style={{ fontSize: 12, color: '#6b7280' }}>
            Check the browser console for the full stack trace.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<p style="padding:24px">No #root element found.</p>';
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

