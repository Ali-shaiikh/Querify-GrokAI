import React, { useEffect, useRef } from 'react';

const FloatingElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create space-themed elements
    const spaceElements = [
      // Planets
      { x: 50, y: 50, size: 40, color: '#8b5cf6', type: 'planet', glow: true },
      { x: window.innerWidth - 80, y: 80, size: 30, color: '#00d4ff', type: 'planet', glow: true },
      { x: 80, y: window.innerHeight - 80, size: 25, color: '#ec4899', type: 'planet', glow: true },
      { x: window.innerWidth - 120, y: window.innerHeight - 120, size: 35, color: '#00ff88', type: 'planet', glow: true },
      
      // Asteroids
      { x: 200, y: 100, size: 8, color: '#ff6b35', type: 'asteroid' },
      { x: window.innerWidth - 200, y: 200, size: 6, color: '#00d4ff', type: 'asteroid' },
      { x: 300, y: window.innerHeight - 150, size: 10, color: '#8b5cf6', type: 'asteroid' },
      { x: window.innerWidth - 300, y: window.innerHeight - 200, size: 7, color: '#ec4899', type: 'asteroid' },
      
      // Cosmic particles
      { x: 150, y: 150, size: 3, color: '#ffffff', type: 'particle' },
      { x: window.innerWidth - 150, y: 150, size: 2, color: '#00d4ff', type: 'particle' },
      { x: 250, y: window.innerHeight - 250, size: 4, color: '#8b5cf6', type: 'particle' },
      { x: window.innerWidth - 250, y: window.innerHeight - 250, size: 3, color: '#ec4899', type: 'particle' },
      { x: 400, y: 300, size: 2, color: '#00ff88', type: 'particle' },
      { x: window.innerWidth - 400, y: 300, size: 3, color: '#ff6b35', type: 'particle' },
      { x: 500, y: window.innerHeight - 300, size: 2, color: '#ffffff', type: 'particle' },
      { x: window.innerWidth - 500, y: window.innerHeight - 300, size: 4, color: '#00d4ff', type: 'particle' }
    ];

    spaceElements.forEach((element, index) => {
      const div = document.createElement('div');
      
      if (element.type === 'planet') {
        // Create planet with gradient and glow
        div.style.cssText = `
          position: fixed;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.size}px;
          height: ${element.size}px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, ${element.color}, ${element.color}dd, ${element.color}88);
          box-shadow: 
            0 0 ${element.size/2}px ${element.color}40,
            inset 2px 2px 4px rgba(255,255,255,0.1),
            inset -2px -2px 4px rgba(0,0,0,0.3);
          opacity: 0.8;
          pointer-events: none;
          z-index: 1;
          animation: planetFloat 20s ease-in-out infinite;
          animation-delay: ${index * 2}s;
        `;
      } else if (element.type === 'asteroid') {
        // Create asteroid with irregular shape
        div.style.cssText = `
          position: fixed;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.size}px;
          height: ${element.size}px;
          border-radius: 30%;
          background: ${element.color};
          opacity: 0.6;
          pointer-events: none;
          z-index: 1;
          animation: asteroidFloat 15s ease-in-out infinite;
          animation-delay: ${index * 1.5}s;
          transform: rotate(${Math.random() * 360}deg);
        `;
      } else if (element.type === 'particle') {
        // Create cosmic particle
        div.style.cssText = `
          position: fixed;
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.size}px;
          height: ${element.size}px;
          border-radius: 50%;
          background: ${element.color};
          opacity: 0.7;
          pointer-events: none;
          z-index: 1;
          animation: particleFloat 12s ease-in-out infinite;
          animation-delay: ${index * 0.8}s;
          box-shadow: 0 0 ${element.size * 2}px ${element.color};
        `;
      }
      
      container.appendChild(div);
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes planetFloat {
        0%, 100% { 
          transform: translateY(0px) scale(1);
          opacity: 0.8;
        }
        25% { 
          transform: translateY(-15px) scale(1.05);
          opacity: 1;
        }
        50% { 
          transform: translateY(-5px) scale(0.95);
          opacity: 0.9;
        }
        75% { 
          transform: translateY(-20px) scale(1.1);
          opacity: 1;
        }
      }
      
      @keyframes asteroidFloat {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg) scale(1);
          opacity: 0.6;
        }
        33% { 
          transform: translateY(-10px) rotate(120deg) scale(1.1);
          opacity: 0.8;
        }
        66% { 
          transform: translateY(-5px) rotate(240deg) scale(0.9);
          opacity: 0.7;
        }
      }
      
      @keyframes particleFloat {
        0%, 100% { 
          transform: translateY(0px) scale(1);
          opacity: 0.7;
        }
        50% { 
          transform: translateY(-8px) scale(1.2);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = '';
      }
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="space-elements-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default FloatingElements;
