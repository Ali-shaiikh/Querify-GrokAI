import React, { useEffect, useState } from 'react';

const SQLFloatingElements = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const sqlKeywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 
      'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER',
      'DROP', 'INDEX', 'TABLE', 'VIEW', 'PROCEDURE', 'FUNCTION'
    ];

    const sqlSymbols = ['{', '}', '[', ']', '(', ')', '<', '>', '=', '!', '&', '|'];
    const dataTypes = ['INT', 'VARCHAR', 'DATETIME', 'BOOLEAN', 'FLOAT', 'TEXT'];

    const createElement = () => {
      const types = ['keyword', 'symbol', 'datatype'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      let content = '';
      switch (type) {
        case 'keyword':
          content = sqlKeywords[Math.floor(Math.random() * sqlKeywords.length)];
          break;
        case 'symbol':
          content = sqlSymbols[Math.floor(Math.random() * sqlSymbols.length)];
          break;
        case 'datatype':
          content = dataTypes[Math.floor(Math.random() * dataTypes.length)];
          break;
        default:
          content = 'SQL';
      }

      return {
        id: Math.random(),
        content,
        type,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 15 + Math.random() * 20,
        size: 0.8 + Math.random() * 0.4
      };
    };

    const newElements = Array.from({ length: 12 }, createElement);
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`absolute text-xs font-mono font-bold opacity-20 select-none
            ${element.type === 'keyword' ? 'text-blue-400' : 
              element.type === 'symbol' ? 'text-green-400' : 'text-purple-400'}
            ${element.type === 'keyword' ? 'animate-sqlGlow' : ''}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${element.duration}s`,
            fontSize: `${element.size}rem`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {element.content}
        </div>
      ))}
      
      {/* Data stream lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30"
            style={{
              left: `${20 + i * 15}%`,
              height: '100%',
              animation: `dataStream ${8 + i * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SQLFloatingElements;
