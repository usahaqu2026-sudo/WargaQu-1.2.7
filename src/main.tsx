import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { pwaService } from './services/pwaService.ts';
import './index.css';

// Inisialisasi Service Worker PWA (Offline-first & kompatibel dengan GitHub Pages)
pwaService.registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
