
import React from 'react'; 
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create the root with React 18's createRoot API
const root = createRoot(document.getElementById("root")!);

// Render the app - AuthProvider is handled inside App.tsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
