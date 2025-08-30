import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const DataPreview = () => {
  const { csvData, stats } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!csvData || csvData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No data to preview</p>
      </div>
    );
  }

  const columns = Object.keys(csvData[0]);
  const visibleColumns = showAllColumns ? columns : columns.slice(0, 8);

  // Filter data based on search term
  const filteredData = csvData.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    
    if (sortConfig.direction === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportData = () => {
    const csvContent = [
      columns.join(','),
      ...csvData.map(row => columns.map(col => `"${row[col]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data_preview.csv';
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const getColumnType = (columnName) => {
    const sampleValue = csvData[0][columnName];
    return typeof sampleValue === 'number' ? 'numeric' : 'text';
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
            <h2 className="text-2xl font-bold text-white mb-2">Data Preview</h2>
            <p className="text-white/70">
              Showing {filteredData.length} of {csvData.length} rows
            </p>
          </div>
          <button
            onClick={exportData}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Column Toggle */}
          <button
            onClick={() => setShowAllColumns(!showAllColumns)}
            className="btn-secondary flex items-center space-x-2"
          >
            {showAllColumns ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAllColumns ? 'Show Less' : 'Show All Columns'}</span>
          </button>
        </div>
      </motion.div>

      {/* Data Table */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border border-white/30 h-full flex flex-col">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, 1fr)` }}>
              {visibleColumns.map((column) => (
                <div key={column} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">{column}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      getColumnType(column) === 'numeric' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getColumnType(column)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSort(column)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-auto">
            {sortedData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data matches your search</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedData.slice(0, 100).map((row, rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: rowIndex * 0.01 }}
                    className="px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, 1fr)` }}>
                      {visibleColumns.map((column) => (
                        <div key={column} className="text-sm text-gray-700 truncate">
                          {row[column] !== null && row[column] !== undefined ? String(row[column]) : '-'}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {Math.min(sortedData.length, 100)} of {sortedData.length} rows
                {sortedData.length > 100 && ' (first 100 rows shown)'}
              </span>
              <span>
                {visibleColumns.length} of {columns.length} columns visible
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreview;
