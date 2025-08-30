import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Database, 
  FileText, 
  TrendingUp,
  Hash,
  Type,
  Calendar,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const StatsDashboard = () => {
  const { stats, csvData } = useApp();

  if (!csvData || csvData.length === 0) {
    return null;
  }

  const columns = Object.keys(csvData[0]);
  const numericColumns = columns.filter(col => 
    typeof csvData[0][col] === 'number'
  );
  const textColumns = columns.filter(col => 
    typeof csvData[0][col] === 'string'
  );

  // Calculate additional statistics
  const getColumnStats = (columnName) => {
    const values = csvData.map(row => row[columnName]).filter(val => val !== null && val !== undefined);
    
    if (typeof values[0] === 'number') {
      const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (numericValues.length === 0) return null;
      
      return {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        sum: numericValues.reduce((a, b) => a + b, 0),
        count: numericValues.length
      };
    } else {
      // For text columns, count unique values
      const uniqueValues = new Set(values);
      return {
        uniqueCount: uniqueValues.size,
        totalCount: values.length,
        mostCommon: getMostCommonValue(values)
      };
    }
  };

  const getMostCommonValue = (values) => {
    const counts = {};
    values.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });
    
    let maxCount = 0;
    let mostCommon = null;
    
    Object.entries(counts).forEach(([value, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = value;
      }
    });
    
    return mostCommon;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statCards = [
    {
      title: 'Total Records',
      value: stats.rows.toLocaleString(),
      icon: <Database className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Number of data rows'
    },
    {
      title: 'Total Columns',
      value: stats.columns,
      icon: <FileText className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Number of data columns'
    },
    {
      title: 'Numeric Columns',
      value: stats.numericColumns,
      icon: <Hash className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Columns with numeric data'
    },
    {
      title: 'Text Columns',
      value: stats.textColumns,
      icon: <Type className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Columns with text data'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:scale-105 transition-transform duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {card.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <div className={card.color}>
                  {card.icon}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Column Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numeric Columns Analysis */}
        {numericColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Numeric Columns Analysis</h3>
            </div>
            
            <div className="space-y-3">
              {numericColumns.slice(0, 5).map((column, index) => {
                const stats = getColumnStats(column);
                if (!stats) return null;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{column}</span>
                      <span className="text-sm text-gray-500">{stats.count} values</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Min:</span>
                        <span className="ml-1 font-medium">{stats.min.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Max:</span>
                        <span className="ml-1 font-medium">{stats.max.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg:</span>
                        <span className="ml-1 font-medium">{stats.avg.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Text Columns Analysis */}
        {textColumns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Type className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">Text Columns Analysis</h3>
            </div>
            
            <div className="space-y-3">
              {textColumns.slice(0, 5).map((column, index) => {
                const stats = getColumnStats(column);
                if (!stats) return null;
                
                return (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{column}</span>
                      <span className="text-sm text-gray-500">{stats.uniqueCount} unique</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="mb-1">
                        <span className="text-gray-500">Most common:</span>
                        <span className="ml-1 font-medium truncate">
                          {stats.mostCommon ? String(stats.mostCommon).substring(0, 20) : 'N/A'}
                          {stats.mostCommon && String(stats.mostCommon).length > 20 ? '...' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total values:</span>
                        <span className="ml-1 font-medium">{stats.totalCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Data Quality Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Data Quality Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {((stats.rows / stats.rows) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Data Completeness</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.columns}
            </div>
            <div className="text-sm text-gray-600">Column Diversity</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.numericColumns > 0 ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Numeric Data Available</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsDashboard;
