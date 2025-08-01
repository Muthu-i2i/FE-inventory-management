import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { mockAuthService } from '../mocks/mockAuthService';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return mockAuthService.login(credentials);
  },

  logout: async (): Promise<void> => {
    return mockAuthService.logout();
  },

  refreshToken: async (): Promise<AuthResponse> => {
    return mockAuthService.refreshToken();
  },
};