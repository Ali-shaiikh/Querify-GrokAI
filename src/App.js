import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SQLFloatingElements from './components/SQLFloatingElements';
import ErrorBoundary from './components/ErrorBoundary';

import { AppProvider } from './context/AppContext';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen relative overflow-hidden">
          {/* Tech Grid Pattern */}
          <div className="tech-grid"></div>
          
          {/* Circuit Board Pattern */}
          <div className="circuit-pattern"></div>
          
          {/* SQL Floating Elements */}
          <SQLFloatingElements />
          
          
          
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
          
          <div className="flex h-screen relative z-5">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-6">
                <MainContent />
              </main>
            </div>
          </div>
                  </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
