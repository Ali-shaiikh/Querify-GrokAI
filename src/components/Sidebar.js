import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Github,
  Zap,
  Cpu,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { csvData, stats, actions } = useApp();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-80 tech-sidebar flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl flex items-center justify-center shadow-neon">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white gradient-text">Querify</h2>
            <p className="text-sm text-gray-300">SQL Generator</p>
          </div>
        </div>
      </div>

      {/* Data Status */}
      {csvData && (
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Data Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rows:</span>
              <span className="text-accent-green font-bold font-jetbrains">{stats.rows}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Columns:</span>
              <span className="text-neon-blue font-bold font-jetbrains">{stats.columns}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">File Size:</span>
              <span className="text-neon-purple font-bold font-jetbrains">
                {(stats.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              if (csvData) {
                actions.clearData();
                toast.success('Data cleared');
              }
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-neon-blue hover:bg-gray-800/50 rounded-lg transition-all duration-300 border border-transparent hover:border-neon-blue/30"
          >
            <Database className="w-4 h-4" />
            <span>Clear Data</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="p-6 border-t border-gray-700/50">
        <h3 className="text-sm font-semibold text-neon-blue mb-3 flex items-center">
          <Cpu className="w-4 h-4 mr-2" />
          System Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-neon"></div>
            <span>Backend Connected</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse shadow-neon"></div>
            <span>Ollama AI Ready</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse shadow-neon"></div>
            <span>Database Active</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-jetbrains">v1.0.0</span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-neon-blue transition-colors duration-300"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
