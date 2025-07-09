import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });

  useEffect(() => {
    // On web, assume we're connected
    if (Platform.OS === 'web') {
      const handleOnline = () => setNetworkStatus(prev => ({ 
        ...prev, 
        isConnected: true, 
        isInternetReachable: true 
      }));
      
      const handleOffline = () => setNetworkStatus(prev => ({ 
        ...prev, 
        isConnected: false, 
        isInternetReachable: false 
      }));

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Set initial state
      setNetworkStatus({
        isConnected: navigator.onLine,
        isInternetReachable: navigator.onLine,
        type: 'wifi',
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // For native platforms, use NetInfo
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
      });
    });

    return unsubscribe;
  }, []);

  return networkStatus;
}