import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cross-platform storage adapter
class StorageAdapter {
  static async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    } else {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        return null;
      }
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to AsyncStorage:', error);
      }
    }
  }

  static async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from AsyncStorage:', error);
      }
    }
  }

  static async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    } else {
      try {
        await AsyncStorage.clear();
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    }
  }
}

export default StorageAdapter;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  LAST_LOCATION: '@last_location',
  PREFERENCES: '@preferences',
};