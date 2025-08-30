import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const FileUpload = () => {
  const { actions, csvData } = useApp();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast.error('Please select a valid CSV file');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

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
              // Try to convert to number if possible
              const numValue = parseFloat(value);
              row[header] = isNaN(numValue) ? value : numValue;
            });
            return row;
          });

        actions.setCsvData(data, file.size);
        toast.success(`Successfully uploaded ${file.name} with ${data.length} rows`);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast.error('Error parsing CSV file. Please check the file format.');
        actions.setError('Error parsing CSV file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      actions.setError('Error reading file');
    };

    reader.readAsText(file);
  }, [actions]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Upload Your Data</h2>
        <p className="text-white/80 text-lg">
          Upload a CSV file to start generating SQL queries with AI
        </p>
      </motion.div>

      {/* Upload Area */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <div
            {...getRootProps()}
            className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
              isDragActive
                ? 'border-primary-400 bg-primary-500/10'
                : isDragReject
                ? 'border-red-400 bg-red-500/10'
                : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50'
            }`}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0 
              }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              {isDragReject ? (
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              ) : isDragActive ? (
                <Upload className="w-16 h-16 text-primary-400 mx-auto animate-bounce" />
              ) : csvData ? (
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              ) : (
                <FileText className="w-16 h-16 text-white/60 mx-auto" />
              )}
            </motion.div>

            <div className="space-y-4">
              {isDragReject ? (
                <div>
                  <h3 className="text-xl font-semibold text-red-400 mb-2">
                    Invalid File Type
                  </h3>
                  <p className="text-red-300">
                    Please upload a valid CSV file
                  </p>
                </div>
              ) : isDragActive ? (
                <div>
                  <h3 className="text-xl font-semibold text-primary-400 mb-2">
                    Drop your CSV file here
                  </h3>
                  <p className="text-primary-300">
                    Release to upload your data
                  </p>
                </div>
              ) : csvData ? (
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    File Uploaded Successfully!
                  </h3>
                  <p className="text-green-300 mb-4">
                    Your CSV file has been processed and is ready for query generation
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.clearData();
                      toast.success('File cleared. You can upload a new file.');
                    }}
                    className="btn-secondary"
                  >
                    Upload Different File
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drag & Drop your CSV file
                  </h3>
                  <p className="text-white/70 mb-4">
                    or click to browse and select a file
                  </p>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-white/80 text-sm">
                      Supported format: CSV files only
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions */}
      {!csvData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              How to use Querify
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  1
                </div>
                <p className="text-white/80">Upload your CSV file</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  2
                </div>
                <p className="text-white/80">Ask questions about your data</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  3
                </div>
                <p className="text-white/80">Get AI-generated SQL queries</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;
