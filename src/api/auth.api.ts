import axiosInstance from './axiosConfig';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import { mockAuthService } from '../mocks/mockAuthService';

// Real API implementation
export const realAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      const { access, user } = response.data;
      
      // Store token immediately after successful login
      localStorage.setItem('token', access);
      
      return {
        user: {
          id: user.id.toString(),
          username: user.username,
          role: user.role.toLowerCase()
        },
        token: access
      };
    } catch (error: any) {
      // Enhanced error handling with detailed logging
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        headers: error.config?.headers
      });

      if (error.response?.status === 0 && error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      if (error.response?.status === 403) {
        throw new Error('Access forbidden. Please check your credentials.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('An error occurred during login. Please try again.');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.get('/auth/logout');
    } finally {
      // Always clear local storage on logout attempt
      localStorage.removeItem('token');
    }
  },

  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.get('/auth/refresh');
      const { access, user } = response.data;
      
      localStorage.setItem('token', access);
      
      return {
        user: {
          id: user.id.toString(),
          username: user.username,
          role: user.role.toLowerCase()
        },
        token: access
      };
    } catch (error) {
      // Clear token on refresh failure
      localStorage.removeItem('token');
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/profile');
    const user = response.data;
    
    return {
      id: user.id.toString(),
      username: user.username,
      role: user.role.toLowerCase()
    };
  }
};

// Use real API implementation
export const authService = realAuthService;

// To switch back to mock service, change to: export const authService = mockAuthService;