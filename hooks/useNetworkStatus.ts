import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import OfflineQueue from '@/utils/offlineQueue';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
      setIsLoading(false);
      
      // Process offline queue when connected
      if (state.isConnected) {
        const offlineQueue = OfflineQueue.getInstance();
        offlineQueue.processQueue();
      }
    });

    // Load offline queue on app start
    const loadQueue = async () => {
      const offlineQueue = OfflineQueue.getInstance();
      await offlineQueue.loadQueue();
    };
    
    loadQueue();

    return () => unsubscribe();
  }, []);

  return { isConnected, isLoading };
}