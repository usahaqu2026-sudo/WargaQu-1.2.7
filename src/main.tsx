import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { pwaService } from './services/pwaService.ts';
import './index.css';

// Inisialisasi Service Worker PWA (Offline-first & kompatibel dengan GitHub Pages)
pwaService.registerServiceWorker();

const rootElement = document.getElementById('root')!;
rootElement.setAttribute('data-loaded', 'true');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
