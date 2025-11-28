import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animations.css'
import App from './App.tsx'
import { ThemeProvider } from '@/contexts'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered:', registration);
      },
      (error) => {
        console.log('SW registration failed:', error);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
)
