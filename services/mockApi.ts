// Mock API service for development and demo purposes
import type { ApiResponse, User, Story, Destination, StoryRequest } from '../types/api';

// Mock data storage
let mockUsers: Record<string, any> = {};
let mockStories: Story[] = [];
let currentUser: User | null = null;

// Helper to generate IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Helper to simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  // Auth endpoints
  static async login(email: string, password: string): Promise<ApiResponse<any>> {
    await delay();
    
    // Check if user exists
    const user = Object.values(mockUsers).find(u => u.email === email);
    
    if (user && user.password === password) {
      const token = 'mock-token-' + generateId();
      currentUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
      };
      
      return {
        success: true,
        data: {
          access_token: token,
          refresh_token: 'refresh-' + token,
          expires_in: 3600,
          user: currentUser,
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid email or password'
    };
  }

  static async register(userData: {
    email: string;
    username: string;
    password: string;
    full_name?: string;
  }): Promise<ApiResponse<any>> {
    await delay();    
    // Check if email already exists
    if (Object.values(mockUsers).some(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'Email already registered'
      };
    }
    
    const userId = generateId();
    const newUser = {
      id: userId,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockUsers[userId] = newUser;
    currentUser = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      full_name: newUser.full_name,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
    };
    
    const token = 'mock-token-' + generateId();
    
    return {
      success: true,
      data: {
        access_token: token,
        refresh_token: 'refresh-' + token,
        expires_in: 3600,
        user: currentUser,
      }
    };
  }

  // Story endpoints
  static async generateStory(request: StoryRequest): Promise<ApiResponse<Story>> {
    await delay(2000); // Simulate AI processing time    
    const storyTemplates = [
      {
        title: "The Legend of {location}",
        content: "As you journey through {location}, let me tell you about its fascinating history. Long ago, this area was home to ancient civilizations that left their mark on the landscape. The stories passed down through generations speak of brave explorers and mysterious encounters that shaped the destiny of this place..."
      },
      {
        title: "Hidden Gems Near {location}",
        content: "Not many travelers know about the secret spots around {location}. There's a hidden waterfall just off the main path, where locals say the water has healing properties. The best time to visit is during the golden hour, when the sunlight creates a magical atmosphere..."
      },
      {
        title: "Tales from the Road to {location}",
        content: "Every road has its stories, and the path to {location} is no exception. Travelers have reported seeing mysterious lights dancing across the horizon at night. Some say it's just a natural phenomenon, but the locals have more colorful explanations..."
      }
    ];
    
    const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    const locationName = request.destination || "this magical place";
    
    const story: Story = {
      id: generateId(),
      title: template.title.replace('{location}', locationName),
      content: template.content.replace(/{location}/g, locationName),
      narrator: request.personality || "Default Narrator",
      duration: Math.floor(Math.random() * 180) + 120, // 2-5 minutes
      location: request.location,
      created_at: new Date().toISOString(),
    };
    
    mockStories.push(story);
    
    return {
      success: true,
      data: story
    };
  }
  static async getStories(): Promise<ApiResponse<Story[]>> {
    await delay();
    return {
      success: true,
      data: mockStories
    };
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    await delay();
    
    if (!currentUser) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }
    
    return {
      success: true,
      data: currentUser
    };
  }

  static async getFeaturedDestinations(): Promise<ApiResponse<Destination[]>> {
    await delay();
    
    const mockDestinations: Destination[] = [
      {
        id: '1',
        title: 'Golden Gate Bridge',
        subtitle: 'San Francisco Icon',
        description: 'One of the most photographed bridges in the world',
        image_url: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg',
        location: {
          latitude: 37.8199,
          longitude: -122.4783,
          address: 'Golden Gate Bridge, San Francisco, CA'
        },
        rating: 4.8,
        price_range: 'Free',
        duration: '1-2 hours',
        category: 'Landmark',
        featured: true
      },
      {
        id: '2',
        title: 'Alcatraz Island',
        subtitle: 'Historic Prison',
        description: 'Former federal prison turned popular tourist destination',
        image_url: 'https://images.pexels.com/photos/1158961/pexels-photo-1158961.jpeg',
        location: {
          latitude: 37.8267,
          longitude: -122.4230,
          address: 'Alcatraz Island, San Francisco, CA'
        },
        rating: 4.7,
        price_range: '$$',
        duration: '2-3 hours',
        category: 'Historic Site',
        featured: true
      }
    ];
    
    return {
      success: true,
      data: mockDestinations
    };
  }
}

// Export a function to switch between real and mock API
export const getMockApi = () => MockApiService;