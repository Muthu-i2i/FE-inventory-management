import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import { users, mockCredentials } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(500); // Simulate network delay

    // Check if credentials match mock data
    const isValidAdmin = credentials.username === mockCredentials.admin.username && 
                        credentials.password === mockCredentials.admin.password;
    const isValidManager = credentials.username === mockCredentials.manager.username && 
                          credentials.password === mockCredentials.manager.password;
    const isValidStaff = credentials.username === mockCredentials.staff.username && 
                        credentials.password === mockCredentials.staff.password;

    if (!isValidAdmin && !isValidManager && !isValidStaff) {
      throw new Error('Invalid credentials');
    }

    // Find matching user from mock data
    const user = users.find(u => u.username === credentials.username);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate mock token
    const mockToken = `mock-token-${user.username}-${Date.now()}`;
    
    // Store token in localStorage to maintain session
    localStorage.setItem('token', mockToken);

    return {
      user,
      token: mockToken
    };
  },

  logout: async (): Promise<void> => {
    await delay(500); // Simulate network delay
    localStorage.removeItem('token');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    await delay(500); // Simulate network delay
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract username from mock token
    const username = token.split('-')[2];
    const user = users.find(u => u.username === username);
    
    if (!user) {
      throw new Error('User not found');
    }

    const newToken = `mock-token-${user.username}-${Date.now()}`;
    localStorage.setItem('token', newToken);

    return {
      user,
      token: newToken
    };
  },

  getProfile: async (): Promise<User> => {
    await delay(500); // Simulate network delay

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Extract username from mock token
    const username = token.split('-')[2];
    const user = users.find(u => u.username === username);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
};