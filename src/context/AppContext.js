import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  csvData: null,
  queryHistory: [],
  generatedQueries: [],
  currentQuery: null,
  isLoading: false,
  settings: {
    autoSave: true,
    showExplanations: true,
  },
  stats: {
    rows: 0,
    columns: 0,
    fileSize: 0,
    numericColumns: 0,
    textColumns: 0,
  },
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CSV_DATA':
      return {
        ...state,
        csvData: action.payload,
        stats: action.payload ? {
          rows: action.payload.length,
          columns: action.payload.length > 0 ? Object.keys(action.payload[0]).length : 0,
          fileSize: action.fileSize || 0,
          numericColumns: action.payload.length > 0 ? 
            Object.keys(action.payload[0]).filter(key => 
              typeof action.payload[0][key] === 'number'
            ).length : 0,
          textColumns: action.payload.length > 0 ? 
            Object.keys(action.payload[0]).filter(key => 
              typeof action.payload[0][key] === 'string'
            ).length : 0,
        } : initialState.stats,
      };
    
    case 'ADD_QUERY_TO_HISTORY':
      return {
        ...state,
        queryHistory: [...state.queryHistory, action.payload],
        generatedQueries: [...state.generatedQueries, action.payload.query],
      };
    
    case 'SET_CURRENT_QUERY':
      return {
        ...state,
        currentQuery: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'CLEAR_DATA':
      return {
        ...state,
        csvData: null,
        stats: initialState.stats,
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('queryHistory');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        history.forEach(item => {
          dispatch({ type: 'ADD_QUERY_TO_HISTORY', payload: item });
        });
      } catch (error) {
        console.error('Error loading query history:', error);
      }
    }
    
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save query history to localStorage whenever it changes
  useEffect(() => {
    if (state.queryHistory.length > 0) {
      localStorage.setItem('queryHistory', JSON.stringify(state.queryHistory));
    }
  }, [state.queryHistory]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const value = {
    ...state,
    dispatch,
    actions: {
      setCsvData: (data, fileSize) => 
        dispatch({ type: 'SET_CSV_DATA', payload: data, fileSize }),
      addQueryToHistory: (queryData) => 
        dispatch({ type: 'ADD_QUERY_TO_HISTORY', payload: queryData }),
      setCurrentQuery: (query) => 
        dispatch({ type: 'SET_CURRENT_QUERY', payload: query }),
      setLoading: (loading) => 
        dispatch({ type: 'SET_LOADING', payload: loading }),
      updateSettings: (settings) => 
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
      setError: (error) => 
        dispatch({ type: 'SET_ERROR', payload: error }),
      clearError: () => 
        dispatch({ type: 'CLEAR_ERROR' }),
      clearData: () => 
        dispatch({ type: 'CLEAR_DATA' }),
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
