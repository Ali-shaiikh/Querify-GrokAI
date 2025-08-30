import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, 
  Download, 
  Sparkles, 
  MessageSquare, 
  Code,
  Lightbulb,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const QueryGenerator = () => {
  const { csvData, actions, settings, currentQuery } = useApp();
  const [question, setQuestion] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sqlQuestion, setSqlQuestion] = useState('');

  const sampleQuestions = [
    "Show me all records with values greater than 100",
    "Count the total number of records",
    "Find the average value for numeric columns",
    "Show the top 10 records sorted by a specific column",
    "Find duplicate entries in the data",
    "Filter records by date range",
    "Group data by a specific column and show counts",
    "Calculate the sum of all numeric columns"
  ];

  const handleGenerateQuery = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!csvData) {
      toast.error('Please upload a CSV file first');
      return;
    }

    setIsGenerating(true);
    actions.setLoading(true);

    try {
      // Call the backend API
      const response = await fetch('/api/generate-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          csvData: csvData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate query');
      }

      const result = await response.json();
      
      setGeneratedQuery(result.sql || 'SELECT * FROM data;');
      setExplanation(result.explanation || 'Query generated successfully.');

      // Save to history
      const queryData = {
        question,
        query: result.sql || 'SELECT * FROM data;',
        explanation: result.explanation || 'Query generated successfully.',
        timestamp: new Date().toISOString(),
        template: false
      };

      actions.addQueryToHistory(queryData);
      actions.setCurrentQuery(queryData);

      toast.success('SQL query generated successfully!');
    } catch (error) {
      console.error('Error generating query:', error);
      toast.error('Failed to generate query. Please try again.');
      actions.setError('Failed to generate query. Please try again.');
    } finally {
      setIsGenerating(false);
      actions.setLoading(false);
    }
  };

  const formatExplanation = (explanation) => {
    if (!explanation) return null;
    
    // Simple approach - just format the text with proper styling
    const formattedText = explanation
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('What it does:')) {
          return (
            <div key={index} className="mb-4">
              <h4 className="text-blue-400 font-bold text-lg mb-2">What it does:</h4>
              <p className="text-gray-200 font-medium leading-relaxed">
                {trimmedLine.replace('What it does:', '').trim()}
              </p>
            </div>
          );
        }
        
        if (trimmedLine.startsWith('How it works:')) {
          return (
            <div key={index} className="mb-4">
              <h4 className="text-green-400 font-bold text-lg mb-3">How it works:</h4>
            </div>
          );
        }
        
        if (trimmedLine.match(/^\d+\.\s+/)) {
          // Format numbered steps
          const match = trimmedLine.match(/^(\d+)\.\s+(\w+):\s*(.*)/);
          if (match) {
            const [, stepNum, keyword, explanation] = match;
            return (
              <div key={index} className="flex items-start space-x-3 mb-3">
                <div className="flex items-center space-x-2 min-w-fit">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {stepNum}
                  </span>
                  <span className="font-bold text-green-400 text-lg">{keyword}:</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>
            );
          }
        }
        
        if (trimmedLine && !trimmedLine.startsWith('Keep explanations')) {
          return (
            <p key={index} className="text-gray-200 leading-relaxed mb-2">
              {trimmedLine}
            </p>
          );
        }
        
        return null;
      })
      .filter(Boolean);
    
    return formattedText.length > 0 ? formattedText : (
      <p className="text-gray-200 leading-relaxed">{explanation}</p>
    );
  };



  const handleSqlQuestion = async () => {
    if (!sqlQuestion.trim()) {
      toast.error('Please enter a SQL question');
      return;
    }

    setIsGenerating(true);
    actions.setLoading(true);

    try {
      const response = await fetch('/api/sql-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: sqlQuestion
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get SQL help');
      }

      const result = await response.json();
      
      setGeneratedQuery(result.answer || 'No answer available.');
      setExplanation('SQL Help Response');

      toast.success('SQL help provided!');
    } catch (error) {
      console.error('Error getting SQL help:', error);
      toast.error('Failed to get SQL help. Please try again.');
      actions.setError('Failed to get SQL help. Please try again.');
    } finally {
      setIsGenerating(false);
      actions.setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadQuery = () => {
    const content = `-- Generated SQL Query
-- Question: ${question}
-- Generated on: ${new Date().toLocaleString()}

${generatedQuery}

-- Explanation:
${explanation}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `query_${new Date().toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Query downloaded successfully!');
  };

  const handleSampleQuestion = (sampleQuestion) => {
    setQuestion(sampleQuestion);
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
        <h2 className="text-2xl font-bold text-white mb-2">Generate SQL Queries</h2>
        <p className="text-white/70">
          Ask questions about your data and get AI-generated SQL queries
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Question Input */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-800">Ask About Your Data</h3>
            </div>
            
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Show me all students with grades higher than 80"
              className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 bg-white/90 resize-none"
            />
            
            <button
              onClick={handleGenerateQuery}
              disabled={isGenerating || !question.trim()}
              className="btn-primary w-full mt-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate SQL Query</span>
                </>
              )}
            </button>
          </div>

          {/* Sample Questions */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-800">Sample Questions</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {sampleQuestions.map((sampleQuestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleQuestion(sampleQuestion)}
                  className="text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                >
                  {sampleQuestion}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Help */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">SQL Help</h3>
            </div>
            
            <input
              type="text"
              value={sqlQuestion}
              onChange={(e) => setSqlQuestion(e.target.value)}
              placeholder="e.g., What are joins?"
              className="input-field mb-4"
            />
            
            <button
              onClick={handleSqlQuestion}
              disabled={isGenerating || !sqlQuestion.trim()}
              className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask SQL Question</span>
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Generated Query */}
          <AnimatePresence>
            {generatedQuery && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Generated SQL Query</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(generatedQuery)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadQuery}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download query"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
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
                    {generatedQuery}
                  </SyntaxHighlighter>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation */}
          <AnimatePresence>
            {explanation && settings.showExplanations && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Explanation</h3>
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="text-gray-200 leading-relaxed">
                    {formatExplanation(explanation)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Query Display */}
          <AnimatePresence>
            {currentQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-800">Current Query</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Question:</p>
                    <p className="text-gray-800 bg-gray-50 rounded-lg p-3">
                      {currentQuery.question}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Generated:</p>
                    <p className="text-xs text-gray-500">
                      {new Date(currentQuery.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QueryGenerator;
