import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { users, mockCredentials } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Call real API for token
    try {
      const response = await fetch('https://be-inventory-management.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      // API returns { access: token, refresh: token }
      // Map user info from local mock data
      const user = users.find(u => u.username === credentials.username);
      if (!user) {
        throw new Error('User not found in local mock data');
      }
      return {
        user,
        token: data.access
      };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
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