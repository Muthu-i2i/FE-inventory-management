import axiosInstance from './axiosConfig';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', {
      username: credentials.username,
      password: credentials.password
    });
    
    // The API returns { access: token, refresh: token, user: {...} }
    const { access, user } = response.data;
    
    return {
      user: {
        id: user.id.toString(),
        username: user.username,
        role: user.role.toLowerCase()
      },
      token: access
    };
  },

  logout: async (): Promise<void> => {
    await axiosInstance.get('/auth/logout');
    // Clear local storage in the auth slice
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.get('/auth/refresh');
    const { access, user } = response.data;
    
    return {
      user: {
        id: user.id.toString(),
        username: user.username,
        role: user.role.toLowerCase()
      },
      token: access
    };
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