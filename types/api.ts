export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface StoryRequest {
  location: {
    latitude: number;
    longitude: number;
  };
  destination?: string;
  context?: string;
  personality?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  narrator: string;
  duration: number;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
}

export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rating: number;
  price_range: string;
  duration: string;
  category: string;
  featured: boolean;
}