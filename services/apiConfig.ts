import { ApiService } from './api';
import { MockApiService } from './mockApi';

// Environment configuration
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true' || 
                    process.env.NODE_ENV === 'development' ||
                    !process.env.EXPO_PUBLIC_API_URL;

// Create a unified API interface
export const API = USE_MOCK_API ? MockApiService : ApiService;

// Export configuration status
export const isUsingMockAPI = () => USE_MOCK_API;

// Helper to switch between APIs dynamically (useful for development)
let currentAPI = API;

export const switchToMockAPI = () => {
  currentAPI = MockApiService;
};

export const switchToRealAPI = () => {
  currentAPI = ApiService;
};

export const getCurrentAPI = () => currentAPI;

// Log which API is being used
if (USE_MOCK_API) {
  console.log('🔧 Using Mock API for development');
} else {
  console.log('🌐 Using Real API:', process.env.EXPO_PUBLIC_API_URL);
}