import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AgentContextProvider } from './context/AgentContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AgentContextProvider>
        <App />
      </AgentContextProvider>
    </BrowserRouter>
  </StrictMode>
);
