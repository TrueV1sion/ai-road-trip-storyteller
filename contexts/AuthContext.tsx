import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import type { User, AuthTokens, LoginRequest, RegisterRequest, ApiResponse } from '../types/api';
import { API } from '../services/apiConfig';
import StorageAdapter, { STORAGE_KEYS as STORAGE } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<ApiResponse<{ user: User; tokens: AuthTokens }>>;
  register: (data: RegisterRequest) => Promise<ApiResponse<{ user: User; tokens: AuthTokens }>>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKENS: 'auth_tokens',
} as const;

// Secure storage wrapper that falls back to AsyncStorage on web
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return AsyncStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  // Initialize auth state from secure storage
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto refresh tokens when they're about to expire
  useEffect(() => {
    if (!tokens) return;

    const now = Date.now();
    const expiresAt = now + (tokens.expires_in * 1000);
    const refreshAt = expiresAt - (5 * 60 * 1000); // Refresh 5 minutes before expiry
    const timeUntilRefresh = refreshAt - now;

    if (timeUntilRefresh > 0) {
      const timer = setTimeout(() => {
        refreshTokens();
      }, timeUntilRefresh);

      return () => clearTimeout(timer);
    }
  }, [tokens]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const [storedUser, storedTokens] = await Promise.all([
        secureStorage.getItem(STORAGE_KEYS.USER),
        secureStorage.getItem(STORAGE_KEYS.TOKENS),
      ]);
      
      if (storedUser && storedTokens) {
        const parsedUser = JSON.parse(storedUser) as User;
        const parsedTokens = JSON.parse(storedTokens) as AuthTokens;
        
        // Check if tokens are still valid
        const now = Date.now();
        const issuedAt = now - (parsedTokens.expires_in * 1000);
        const isExpired = now > issuedAt + (parsedTokens.expires_in * 1000);
        
        if (!isExpired) {
          setUser(parsedUser);
          setTokens(parsedTokens);
        } else {
          // Try to refresh tokens
          const refreshed = await refreshTokens();
          if (!refreshed) {
            await clearAuth();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuthData = async (userData: User, tokenData: AuthTokens) => {
    try {
      await Promise.all([
        secureStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        secureStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokenData)),
      ]);
      setUser(userData);
      setTokens(tokenData);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  };

  const clearAuth = async () => {
    try {
      await Promise.all([
        secureStorage.removeItem(STORAGE_KEYS.USER),
        secureStorage.removeItem(STORAGE_KEYS.TOKENS),
      ]);
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const login = async (data: LoginRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    try {
      setIsLoading(true);
      
      // Use our API service
      const response = await API.login(data.email, data.password);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Login failed',
        };
      }

      const { user, access_token, refresh_token, expires_in } = response.data;
      const tokens: AuthTokens = {
        access_token,
        refresh_token,
        expires_in,
      };
      
      await storeAuthData(user, tokens);
      
      return {
        success: true,
        data: { user, tokens },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> => {
    try {
      setIsLoading(true);
      
      // Use our API service
      const response = await API.register(data);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Registration failed',
        };
      }

      const { user, access_token, refresh_token, expires_in } = response.data;
      const tokens: AuthTokens = {
        access_token,
        refresh_token,
        expires_in,
      };
      
      await storeAuthData(user, tokens);
      
      return {
        success: true,
        data: { user, tokens },
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Mock registration for development
      if (__DEV__) {
        const mockUser: User = {
          id: '1',
          email: data.email,
          username: data.username,
          full_name: data.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        const mockTokens: AuthTokens = {
          access_token: 'mock_access_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          expires_in: 3600, // 1 hour
        };
        
        await storeAuthData(mockUser, mockTokens);
        
        return {
          success: true,
          data: { user: mockUser, tokens: mockTokens },
        };
      }
      
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      if (!tokens?.refresh_token) {
        return false;
      }

      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.refresh_token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      
      if (user) {
        await storeAuthData(user, result.data.tokens);
      }
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout endpoint if tokens exist
      if (tokens?.access_token) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokens.access_token}`,
            },
          });
        } catch (error) {
          // Ignore logout API errors, still clear local data
          console.warn('Logout API call failed:', error);
        }
      }
      
      await clearAuth();
      
      // Navigate to auth screen
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshTokens,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}