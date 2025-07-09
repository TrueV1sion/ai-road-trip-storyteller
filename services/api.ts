import { Platform } from 'react-native';
import type { ApiResponse, PaginatedResponse, User, Story, Destination, StoryRequest } from '../types/api';
import StorageAdapter, { STORAGE_KEYS } from '../utils/storage';

export class ApiService {
  private static getBaseURL() {
    if (Platform.OS === 'web' && process.env.NODE_ENV === 'production') {
      // In production on Netlify, use relative path for API proxy
      return '/api';
    }
    return process.env.EXPO_PUBLIC_API_URL || 'https://api.ai-roadtrip.com';
  }
  
  private static baseURL = this.getBaseURL();
  private static timeout = 10000;

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': Platform.OS === 'web' ? 'AI-RoadTrip-Web' : `AI-RoadTrip-${Platform.OS}`,
        ...options.headers as Record<string, string>,
      };

      // Add auth token if available and required
      if (requireAuth) {
        const token = await this.getStoredToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error occurred' };
    }
  }

  private static async getStoredToken(): Promise<string | null> {
    try {
      return await StorageAdapter.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Auth endpoints
  static async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
  }

  static async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  }

  static async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }, false);
  }

  static async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  static async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/user/profile');
  }

  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Stories endpoints
  static async generateStory(request: StoryRequest): Promise<ApiResponse<Story>> {
    return this.request('/stories/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getStories(): Promise<ApiResponse<Story[]>> {
    return this.request('/stories');
  }

  static async getStory(id: string): Promise<ApiResponse<Story>> {
    return this.request(`/stories/${id}`);
  }

  static async deleteStory(id: string): Promise<ApiResponse<void>> {
    return this.request(`/stories/${id}`, {
      method: 'DELETE',
    });
  }

  // Destinations endpoints
  static async searchDestinations(query: string, filters?: {
    category?: string;
    priceRange?: string;
    location?: { lat: number; lng: number; radius: number };
  }): Promise<PaginatedResponse<Destination>> {
    const params = new URLSearchParams({ q: query });
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priceRange) params.append('price_range', filters.priceRange);
    if (filters?.location) {
      params.append('lat', filters.location.lat.toString());
      params.append('lng', filters.location.lng.toString());
      params.append('radius', filters.location.radius.toString());
    }

    return this.request(`/destinations/search?${params.toString()}`);
  }

  static async getFeaturedDestinations(): Promise<ApiResponse<Destination[]>> {
    return this.request('/destinations/featured');
  }

  static async getDestination(id: string): Promise<ApiResponse<Destination>> {
    return this.request(`/destinations/${id}`);
  }

  // Favorites endpoints
  static async getFavorites(): Promise<ApiResponse<Destination[]>> {
    return this.request('/user/favorites');
  }

  static async addToFavorites(destinationId: string): Promise<ApiResponse<void>> {
    return this.request('/user/favorites', {
      method: 'POST',
      body: JSON.stringify({ destination_id: destinationId }),
    });
  }

  static async removeFromFavorites(destinationId: string): Promise<ApiResponse<void>> {
    return this.request(`/user/favorites/${destinationId}`, {
      method: 'DELETE',
    });
  }

  // Navigation endpoints
  static async getRoute(origin: string, destination: string): Promise<ApiResponse<any>> {
    return this.request('/navigation/route', {
      method: 'POST',
      body: JSON.stringify({ origin, destination }),
    });
  }

  // Bookings endpoints
  static async getBookings(): Promise<ApiResponse<any[]>> {
    return this.request('/bookings');
  }

  static async createBooking(bookingData: any): Promise<ApiResponse<any>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  static async cancelBooking(bookingId: string): Promise<ApiResponse<void>> {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }
}