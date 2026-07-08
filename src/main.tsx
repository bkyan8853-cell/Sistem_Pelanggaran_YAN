import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

// Global DOM safety patch to prevent Google Translate & browser extension crashes in React
if (typeof window !== "undefined") {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (console) {
        console.warn("removeChild: Parent node mismatch, skipping to prevent crash", this, child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newChild: T, refChild: Node | null): T {
    if (refChild && refChild.parentNode !== this) {
      if (console) {
        console.warn("insertBefore: Reference node parent mismatch, falling back to appendChild", this, newChild, refChild);
      }
      return this.appendChild(newChild);
    }
    return originalInsertBefore.call(this, newChild, refChild) as T;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
