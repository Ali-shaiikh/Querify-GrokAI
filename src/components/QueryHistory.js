import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  History, 
  Search, 
  Filter, 
  Copy, 
  Download, 
  Trash2,
  Calendar,
  MessageSquare,
  Code,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const QueryHistory = () => {
  const { queryHistory, actions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);

  const filteredHistory = queryHistory.filter(item => {
    const matchesSearch = item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.query?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'templates' && item.template) ||
                         (filterType === 'generated' && !item.template);
    
    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadQuery = (queryData) => {
    const content = `-- Generated SQL Query
-- Question: ${queryData.question}
-- Generated on: ${new Date(queryData.timestamp).toLocaleString()}
-- Type: ${queryData.template ? 'Template' : 'Generated'}

${queryData.query}

-- Explanation:
${queryData.explanation || 'No explanation provided.'}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query_${new Date(queryData.timestamp).toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Query downloaded successfully!');
  };

  const deleteQuery = (index) => {
    // Remove from history (this would need to be implemented in the context)
    toast.success('Query deleted successfully!');
  };

  const exportAllHistory = () => {
    if (queryHistory.length === 0) {
      toast.error('No queries to export');
      return;
    }

    const content = queryHistory.map((item, index) => 
      `-- Query ${index + 1}
-- Question: ${item.question}
-- Generated on: ${new Date(item.timestamp).toLocaleString()}
-- Type: ${item.template ? 'Template' : 'Generated'}

${item.query}

-- Explanation:
${item.explanation || 'No explanation provided.'}

-- ==========================================
`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `querify_history_${new Date().toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('All queries exported successfully!');
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const queryTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - queryTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Query History</h2>
            <p className="text-white/70">
              {queryHistory.length} queries generated
            </p>
          </div>
          {queryHistory.length > 0 && (
            <button
              onClick={exportAllHistory}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="all">All Queries</option>
            <option value="generated">Generated</option>
            <option value="templates">Templates</option>
          </select>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Recent Queries</h3>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {queryHistory.length === 0 ? 'No queries generated yet' : 'No queries match your search'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedQuery === item
                        ? 'bg-primary-50 border-2 border-primary-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedQuery(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {item.template ? (
                            <Code className="w-4 h-4 text-purple-500" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {item.question || 'Generated Query'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {getTimeAgo(item.timestamp)}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.query.substring(0, 100)}
                          {item.query.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Query Details */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedQuery ? (
              <motion.div
                key={selectedQuery.timestamp}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Query Header */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {selectedQuery.template ? (
                        <Code className="w-5 h-5 text-purple-500" />
                      ) : (
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {selectedQuery.template ? 'Template Query' : 'Generated Query'}
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(selectedQuery.query)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy query"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadQuery(selectedQuery)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download query"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Question:</p>
                      <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                        {selectedQuery.question || 'No question provided'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(selectedQuery.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(selectedQuery.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SQL Query */}
                <div className="card">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">SQL Query</h3>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="sql"
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        padding: '1rem',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      {selectedQuery.query}
                    </SyntaxHighlighter>
                  </div>
                </div>

                {/* Explanation */}
                {selectedQuery.explanation && (
                  <div className="card">
                    <div className="flex items-center space-x-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-gray-800">Explanation</h3>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedQuery.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">Select a query to view details</p>
                  <p className="text-gray-400 text-sm">
                    Choose a query from the list to see its full details and explanation
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;
