import { useState, useEffect } from 'react';
import { Content } from './layout/Content';
import { Sidebar } from './layout/Sidebar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useADJState, useADJActions } from './store/ADJStore';

function App() {
  const { isLoading, error, adjPath, config } = useADJState();
  const { loadConfig, setError, resetState } = useADJActions();
  const [selectedSection, setSelectedSection] = useState('general_info');
  const [pathInput, setPathInput] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('App state:', { isLoading, error, adjPath: adjPath || 'null', hasConfig: !!config });
  }, [isLoading, error, adjPath, config]);

  const handleLoadConfig = async () => {
    if (!pathInput.trim()) {
      setError('Please enter a valid ADJ path');
      return;
    }
    
    await loadConfig(pathInput.trim());
  };

  useEffect(() => {
    if (adjPath && !config && !isLoading && !error) {
      console.log('Attempting to load stored ADJ path:', adjPath);
      loadConfig(adjPath).catch((error) => {
        console.error('Failed to load stored ADJ path:', error);
        console.log('Will show setup form due to failed path load');
        // The error will be set by loadConfig, causing shouldShowSetup to become true
      });
    }
  }, [adjPath, config, isLoading, loadConfig, error]);

  // Show the setup form if no adjPath OR if there's an error loading config
  const shouldShowSetup = !adjPath || (error && !config);

  if (shouldShowSetup) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">ADJ Valet</h1>
        <p className="text-gray-600">
          {adjPath && error ? 'The cached ADJ path is no longer valid. Please enter a new path:' : 
           adjPath ? 'Failed to load configuration. Enter a new path:' : 
           'Enter the path to your ADJ directory to get started'}
        </p>
        
        {adjPath && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg max-w-md w-full">
            <p className="text-sm">
              {error ? 'Invalid cached path:' : 'Previous path:'} 
              <code className="bg-yellow-100 px-1 rounded ml-1">{adjPath}</code>
            </p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => setPathInput(adjPath)}
                className="text-xs text-yellow-600 hover:text-yellow-800 underline"
              >
                Use this path again
              </button>
              <span className="text-xs text-yellow-400">•</span>
              <button 
                onClick={resetState}
                className="text-xs text-yellow-600 hover:text-yellow-800 underline"
              >
                Clear and start fresh
              </button>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter ADJ directory path..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLoadConfig()}
            disabled={isLoading}
          />
          
          <button
            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
              isLoading || !pathInput.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
            onClick={handleLoadConfig}
            disabled={isLoading || !pathInput.trim()}
          >
            {isLoading ? 'Loading...' : 'Load Configuration'}
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span className="text-gray-600">Loading ADJ configuration...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md w-full">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error:</span>
            </div>
            <p className="mt-1">{error}</p>
            <details className="mt-2">
              <summary className="text-sm cursor-pointer hover:underline">Troubleshooting</summary>
              <ul className="text-sm mt-1 ml-4 list-disc">
                <li>Make sure the backend is running</li>
                <li>Check that the ADJ directory path exists</li>
                <li>Verify the ADJ directory contains valid configuration files</li>
                <li>Check browser console for more details</li>
              </ul>
            </details>
          </div>
        )}
      </div>
    );
  }

  if (isLoading && !config) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-600">Loading ADJ configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Configuration Loaded</h2>
          <p className="text-gray-600">Failed to load the ADJ configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar
        selectedSection={selectedSection}
        onSelectedSection={setSelectedSection}
      />
      <Content
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
      />
      
      {isLoading && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span className="text-sm text-gray-600">Saving...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-sm">Error</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;