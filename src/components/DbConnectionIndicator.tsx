import { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import apiClient from '../api/client';

export const DbConnectionIndicator = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiClient.get('/health');
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    // Optional: poll for connection status
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 flex items-center space-x-1 opacity-50 hover:opacity-100 transition-opacity">
      <Database 
        size={16} 
        className={isConnected === null ? 'text-gray-400' : isConnected ? 'text-blue-500' : 'text-gray-400'} 
      />
      <span className={`text-xs font-mono ${isConnected === null ? 'text-gray-400' : isConnected ? 'text-blue-500' : 'text-gray-400'}`}>
        {isConnected === null ? '...' : isConnected ? 'link OK' : 'link OFF'}
      </span>
    </div>
  );
};
