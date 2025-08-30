// API Configuration for different environments
const API_CONFIG = {
  // Development (local)
  development: {
    baseURL: 'http://localhost:5000',
    timeout: 30000
  },
  // Production (Vercel)
  production: {
    baseURL: '', // Empty for same-domain API calls in Vercel
    timeout: 30000
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const apiConfig = API_CONFIG[environment];

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  // In production (Vercel), use relative URLs for same-domain API calls
  const url = environment === 'production' 
    ? endpoint 
    : `${apiConfig.baseURL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    timeout: apiConfig.timeout
  };

  const finalOptions = {
    ...defaultOptions,
    ...options
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
