import { useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import type { ApiResponse } from '../types/api';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

export function useApiClient() {
  const { tokens, refreshTokens, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = useCallback(async <T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> => {
    try {
      setIsLoading(true);

      const {
        method = 'GET',
        headers = {},
        body,
        requireAuth = true,
      } = config;

      // Prepare request headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
      };

      // Add authorization header if required and available
      if (requireAuth && tokens?.access_token) {
        requestHeaders.Authorization = `Bearer ${tokens.access_token}`;
      }

      // Make the request
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle 401 Unauthorized - try to refresh tokens
      if (response.status === 401 && requireAuth && tokens?.refresh_token) {
        const refreshed = await refreshTokens();
        if (refreshed) {
          // Retry the request with new tokens
          requestHeaders.Authorization = `Bearer ${tokens.access_token}`;
          const retryResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            return data;
          } else if (retryResponse.status === 401) {
            // Still unauthorized after refresh, logout user
            await logout();
            return {
              success: false,
              error: 'Session expired. Please log in again.',
            };
          }
        } else {
          // Refresh failed, logout user
          await logout();
          return {
            success: false,
            error: 'Session expired. Please log in again.',
          };
        }
      }

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `Request failed with status ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  }, [tokens, refreshTokens, logout]);

  return {
    makeRequest,
    isLoading,
  };
}