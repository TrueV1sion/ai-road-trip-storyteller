import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Destination, Story } from '../types/api';

interface AppState {
  // Destinations
  featuredDestinations: Destination[];
  searchResults: Destination[];
  favorites: Destination[];
  
  // Stories
  stories: Story[];
  currentStory: Story | null;
  
  // UI State
  isLoading: boolean;
  searchQuery: string;
  selectedFilters: string[];
  
  // Location
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  
  // Navigation
  isNavigating: boolean;
  currentRoute: any | null;
  
  // Actions
  setFeaturedDestinations: (destinations: Destination[]) => void;
  setSearchResults: (results: Destination[]) => void;
  setFavorites: (favorites: Destination[]) => void;
  addToFavorites: (destination: Destination) => void;
  removeFromFavorites: (destinationId: string) => void;
  
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  setCurrentStory: (story: Story | null) => void;
  
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilters: (filters: string[]) => void;
  toggleFilter: (filter: string) => void;
  
  setCurrentLocation: (location: { latitude: number; longitude: number } | null) => void;
  setNavigating: (navigating: boolean) => void;
  setCurrentRoute: (route: any | null) => void;
  
  clearSearch: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    featuredDestinations: [],
    searchResults: [],
    favorites: [],
    stories: [],
    currentStory: null,
    isLoading: false,
    searchQuery: '',
    selectedFilters: [],
    currentLocation: null,
    isNavigating: false,
    currentRoute: null,

    // Destination actions
    setFeaturedDestinations: (featuredDestinations) => {
      set({ featuredDestinations });
    },

    setSearchResults: (searchResults) => {
      set({ searchResults });
    },

    setFavorites: (favorites) => {
      set({ favorites });
    },

    addToFavorites: (destination) => {
      const { favorites } = get();
      if (!favorites.find(fav => fav.id === destination.id)) {
        set({ favorites: [...favorites, destination] });
      }
    },

    removeFromFavorites: (destinationId) => {
      const { favorites } = get();
      set({ favorites: favorites.filter(fav => fav.id !== destinationId) });
    },

    // Story actions
    setStories: (stories) => {
      set({ stories });
    },

    addStory: (story) => {
      const { stories } = get();
      set({ stories: [story, ...stories] });
    },

    setCurrentStory: (currentStory) => {
      set({ currentStory });
    },

    // UI actions
    setLoading: (isLoading) => {
      set({ isLoading });
    },

    setSearchQuery: (searchQuery) => {
      set({ searchQuery });
    },

    setSelectedFilters: (selectedFilters) => {
      set({ selectedFilters });
    },

    toggleFilter: (filter) => {
      const { selectedFilters } = get();
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter(f => f !== filter)
        : [...selectedFilters, filter];
      set({ selectedFilters: newFilters });
    },

    // Location actions
    setCurrentLocation: (currentLocation) => {
      set({ currentLocation });
    },

    setNavigating: (isNavigating) => {
      set({ isNavigating });
    },

    setCurrentRoute: (currentRoute) => {
      set({ currentRoute });
    },

    // Utility actions
    clearSearch: () => {
      set({
        searchQuery: '',
        searchResults: [],
        selectedFilters: [],
      });
    },

    reset: () => {
      set({
        featuredDestinations: [],
        searchResults: [],
        favorites: [],
        stories: [],
        currentStory: null,
        isLoading: false,
        searchQuery: '',
        selectedFilters: [],
        currentLocation: null,
        isNavigating: false,
        currentRoute: null,
      });
    },
  }))
);