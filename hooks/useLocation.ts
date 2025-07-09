import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

interface LocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export function useLocation(autoRequest = false) {
  const [state, setState] = useState<LocationState>({
    location: null,
    isLoading: false,
    error: null,
    hasPermission: false,
  });

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // Use browser geolocation API
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            setState(prev => ({
              ...prev,
              error: 'Geolocation is not supported by this browser',
              hasPermission: false,
            }));
            resolve(false);
            return;
          }

          navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
            setState(prev => ({ ...prev, hasPermission: result.state === 'granted' }));
            resolve(result.state === 'granted');
          }).catch(() => {
            // Fallback: try to get location anyway
            resolve(true);
          });
        });
      }

      // Native platforms
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      
      setState(prev => ({ ...prev, hasPermission }));
      
      if (!hasPermission) {
        setState(prev => ({
          ...prev,
          error: 'Location permission denied',
        }));
      }
      
      return hasPermission;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to request location permission',
        hasPermission: false,
      }));
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return null;
      }

      if (Platform.OS === 'web') {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              };

              // Try to get address using reverse geocoding
              try {
                if (Platform.OS !== 'web') {
                  const addresses = await Location.reverseGeocodeAsync(locationData);
                  if (addresses.length > 0) {
                    const addr = addresses[0];
                    locationData.address = `${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`.trim();
                  }
                }
              } catch (error) {
                console.warn('Failed to get address:', error);
              }

              setState(prev => ({
                ...prev,
                location: locationData,
                isLoading: false,
              }));
              
              resolve(locationData);
            },
            (error) => {
              const errorMessage = getLocationErrorMessage(error.code);
              setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
              }));
              reject(new Error(errorMessage));
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000, // 5 minutes
            }
          );
        });
      }

      // Native platforms
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      const locationData: LocationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
      };

      // Get address
      try {
        const addresses = await Location.reverseGeocodeAsync(locationData);
        if (addresses.length > 0) {
          const addr = addresses[0];
          locationData.address = `${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`.trim();
        }
      } catch (error) {
        console.warn('Failed to get address:', error);
      }

      setState(prev => ({
        ...prev,
        location: locationData,
        isLoading: false,
      }));

      return locationData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      return null;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Auto request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      getCurrentLocation();
    }
  }, [autoRequest]);

  return {
    ...state,
    getCurrentLocation,
    requestPermission,
    clearError,
  };
}

function getLocationErrorMessage(code: number): string {
  switch (code) {
    case 1: // PERMISSION_DENIED
      return 'Location access denied. Please enable location services.';
    case 2: // POSITION_UNAVAILABLE
      return 'Location information unavailable.';
    case 3: // TIMEOUT
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while getting location.';
  }
}