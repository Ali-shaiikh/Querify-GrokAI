import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Querify</h1>
              <p className="text-xl text-gray-300">AI-Powered SQL Generator</p>
              <p className="text-sm text-gray-400 mt-2">App is loading...</p>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(15, 15, 25, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
                  color: '#ffffff',
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
