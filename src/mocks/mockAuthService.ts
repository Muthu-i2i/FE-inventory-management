import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { users, mockCredentials } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await delay(1000);

    // Check if credentials match any mock user
    const isAdmin = credentials.username === mockCredentials.admin.username && 
                   credentials.password === mockCredentials.admin.password;
    
    const isManager = credentials.username === mockCredentials.manager.username && 
                     credentials.password === mockCredentials.manager.password;
    
    const isStaff = credentials.username === mockCredentials.staff.username && 
                    credentials.password === mockCredentials.staff.password;

    if (isAdmin || isManager || isStaff) {
      const user = users.find(u => u.username === credentials.username);
      if (user) {
        // Generate a mock JWT token
        const token = `mock-jwt-token-${user.username}-${Date.now()}`;
        return {
          user,
          token
        };
      }
    }

    // Simulate API error response
    throw new Error('Invalid credentials');
  },

  logout: async (): Promise<void> => {
    await delay(500);
    // Clear local storage in the auth slice
  },

  refreshToken: async (): Promise<AuthResponse> => {
    await delay(500);
    throw new Error('Token refresh not implemented in mock service');
  },
};