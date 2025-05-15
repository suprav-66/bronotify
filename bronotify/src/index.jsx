import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/bronotify/sw.js')
  .then(reg => {
    console.log('Service Worker registered:', reg.scope);
  })
  .catch(error => {
    console.error('Service Worker registration failed:', error); // <--- This will show the real error!
  });
  });
} else {  // Fallback for browsers that don't support service workers
  console.log('Service Workers are not supported in this browser.');
} 