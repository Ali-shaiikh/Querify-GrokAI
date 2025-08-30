import React from 'react';
import { motion } from 'framer-motion';
import { Database, Sparkles, Cpu } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl border-b border-gray-700/50 shadow-neon"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl backdrop-blur-sm shadow-neon">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white text-shadow-lg gradient-text">
                Querify
              </h1>
              <p className="text-sm text-gray-300 font-medium">
                AI-Powered SQL Generator
              </p>
            </div>
          </motion.div>

          {/* Right side - Status and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-neon"></div>
              <span className="text-sm text-gray-200 font-medium">Ready</span>
            </div>

            {/* AI Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
              <Sparkles className="w-4 h-4 text-neon-blue animate-pulse" />
              <span className="text-sm text-gray-200 font-medium">Ollama AI</span>
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
              <Cpu className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-gray-200 font-medium">Online</span>
            </div>

            {/* Version Badge */}
            <div className="px-3 py-1 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-lg backdrop-blur-sm border border-neon-blue/30">
              <span className="text-xs text-neon-blue font-bold">v1.0.0</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
