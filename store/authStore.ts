import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { User, AuthTokens } from '../types/api';
import { Storage } from '../utils/storage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
  storeAuthData: (user: User, tokens: AuthTokens) => Promise<void>;
}

const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKENS: 'auth_tokens',
} as const;

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) => {
      set({ user, isAuthenticated: !!user && !!get().tokens });
    },

    setTokens: (tokens) => {
      set({ tokens, isAuthenticated: !!get().user && !!tokens });
    },

    setLoading: (isLoading) => {
      set({ isLoading });
    },

    clearAuth: () => {
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
      });
      
      // Clear stored data
      Storage.removeItem(STORAGE_KEYS.USER);
      Storage.removeItem(STORAGE_KEYS.TOKENS);
    },

    initializeAuth: async () => {
      try {
        set({ isLoading: true });
        
        const storedData = await Storage.multiGet([
          STORAGE_KEYS.USER,
          STORAGE_KEYS.TOKENS,
        ]);
        
        const userData = storedData[STORAGE_KEYS.USER];
        const tokensData = storedData[STORAGE_KEYS.TOKENS];
        
        if (userData && tokensData) {
          const user = JSON.parse(userData) as User;
          const tokens = JSON.parse(tokensData) as AuthTokens;
          
          // Check if tokens are still valid (basic check)
          const now = Date.now();
          const tokenAge = now - (new Date(user.updated_at).getTime());
          const maxAge = tokens.expires_in * 1000;
          
          if (tokenAge < maxAge) {
            set({
              user,
              tokens,
              isAuthenticated: true,
            });
          } else {
            // Tokens expired, clear auth
            get().clearAuth();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        get().clearAuth();
      } finally {
        set({ isLoading: false });
      }
    },

    storeAuthData: async (user, tokens) => {
      try {
        await Storage.multiSet({
          [STORAGE_KEYS.USER]: JSON.stringify(user),
          [STORAGE_KEYS.TOKENS]: JSON.stringify(tokens),
        });
        
        set({
          user,
          tokens,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error storing auth data:', error);
        throw new Error('Failed to store authentication data');
      }
    },
  }))
);

// Subscribe to auth changes for side effects
useAuthStore.subscribe(
  (state) => state.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      // Clear any other stores or cached data when user logs out
      console.log('User logged out, clearing app state');
    }
  }
);