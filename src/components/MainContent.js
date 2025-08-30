import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Code,
  Sparkles,
  Copy,
  Download,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const MainContent = () => {
  const { csvData, actions } = useApp();
  const [question, setQuestion] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sqlHelpQuestion, setSqlHelpQuestion] = useState('');
  const [sqlHelpAnswer, setSqlHelpAnswer] = useState('');
  const [isGettingHelp, setIsGettingHelp] = useState(false);

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

      toast.success('SQL query generated successfully!');
    } catch (error) {
      console.error('Error generating query:', error);
      toast.error('Failed to generate query. Please try again.');
    } finally {
      setIsGenerating(false);
      actions.setLoading(false);
    }
  };

  const handleSqlHelp = async () => {
    if (!sqlHelpQuestion.trim()) {
      toast.error('Please enter a SQL question');
      return;
    }

    setIsGettingHelp(true);

    try {
      const response = await fetch('/api/sql-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: sqlHelpQuestion
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get SQL help');
      }

      const result = await response.json();
      setSqlHelpAnswer(result.answer || 'No answer available.');
      toast.success('SQL help provided!');
    } catch (error) {
      console.error('Error getting SQL help:', error);
      toast.error('Failed to get SQL help. Please try again.');
    } finally {
      setIsGettingHelp(false);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-content">
      {/* Step 1: Upload CSV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center shadow-neon">
            <span className="text-white font-bold">1</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Upload Your CSV File</h2>
            <p className="text-gray-300">Start by uploading your data file</p>
          </div>
        </div>

        {!csvData ? (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/30">
            <Upload className="w-12 h-12 text-neon-blue mx-auto mb-4" />
            <p className="text-gray-300 mb-4">Drag and drop your CSV file here, or click to browse</p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const csvText = event.target.result;
                      const lines = csvText.split('\n');
                      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                      
                      const data = lines.slice(1)
                        .filter(line => line.trim())
                        .map(line => {
                          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                          const row = {};
                          headers.forEach((header, index) => {
                            const value = values[index];
                            const numValue = parseFloat(value);
                            row[header] = isNaN(numValue) ? value : numValue;
                          });
                          return row;
                        });

                      actions.setCsvData(data, file.size);
                      toast.success(`Successfully uploaded ${file.name} with ${data.length} rows`);
                    } catch (error) {
                      toast.error('Error parsing CSV file');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="btn-primary cursor-pointer">
              Choose CSV File
            </label>
          </div>
        ) : (
          <div className="text-center">
            <FileText className="w-12 h-12 text-accent-green mx-auto mb-4" />
            <p className="text-accent-green font-medium">CSV file uploaded successfully!</p>
            <button
              onClick={() => actions.clearData()}
              className="text-gray-400 hover:text-neon-blue mt-2 transition-colors duration-300"
            >
              Upload different file
            </button>
          </div>
        )}
      </motion.div>

      {/* Step 2: Data Preview */}
      {csvData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-green to-neon-blue rounded-full flex items-center justify-center shadow-neon">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Data Preview</h2>
              <p className="text-gray-300">Preview of your uploaded data</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="tech-table">
              <thead>
                <tr>
                  {Object.keys(csvData[0] || {}).map((header, index) => (
                    <th key={index}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 5).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-400 mt-2">
              Showing first 5 rows of {csvData.length} total rows
            </p>
          </div>
        </motion.div>
      )}

      {/* Step 3: Ask Questions */}
      {csvData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center shadow-neon">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Ask About Your Data</h2>
              <p className="text-gray-300">Ask questions and get AI-generated SQL queries</p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Show me all students with grades higher than 80"
              className="input-field h-24 resize-none"
            />
            
            <button
              onClick={handleGenerateQuery}
              disabled={isGenerating || !question.trim()}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </motion.div>
      )}

      {/* Step 4: Generated Query */}
      {generatedQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">4</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Generated SQL Query</h2>
              <p className="text-gray-600">Your AI-generated SQL query with explanation</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* SQL Query */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <Code className="w-5 h-5 text-green-500" />
                  <span>SQL Query</span>
                </h3>
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
            </div>

            {/* Explanation */}
            {explanation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span>Query Explanation</span>
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="space-y-4">
                    {/* What it does */}
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">What it does:</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {explanation.includes('What it does:') 
                          ? explanation.split('What it does:')[1]?.split('How it works:')[0]?.trim() || explanation
                          : explanation
                        }
                      </p>
                    </div>

                    {/* How it works */}
                    {explanation.includes('How it works:') && (
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">How it works:</h4>
                        <div className="space-y-2">
                          {explanation.split('How it works:')[1]?.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();
                            if (trimmedLine && trimmedLine.match(/^\d+\./)) {
                              const parts = trimmedLine.split(':');
                              if (parts.length >= 2) {
                                return (
                                  <div key={index} className="flex space-x-3">
                                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-semibold text-green-600">
                                        {parts[0].replace('.', '')}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-600 leading-relaxed">
                                        {parts.slice(1).join(':').trim()}
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Simple explanation if no structured format */}
                    {!explanation.includes('What it does:') && !explanation.includes('How it works:') && (
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Explanation:</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Step 5: SQL Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">5</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">SQL Help</h2>
            <p className="text-gray-600">Ask questions about SQL concepts and get explanations</p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={sqlHelpQuestion}
            onChange={(e) => setSqlHelpQuestion(e.target.value)}
            placeholder="e.g., What are SQL JOINs?"
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
          />
          
          <button
            onClick={handleSqlHelp}
            disabled={isGettingHelp || !sqlHelpQuestion.trim()}
            className="btn-secondary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGettingHelp ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Getting Help...</span>
              </>
            ) : (
              <>
                <HelpCircle className="w-4 h-4" />
                <span>Get SQL Help</span>
              </>
            )}
          </button>
        </div>

        {/* SQL Help Answer */}
        {sqlHelpAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Answer</h3>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sqlHelpAnswer}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MainContent;
