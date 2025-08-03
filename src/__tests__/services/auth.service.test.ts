import { authService } from '../../api/auth.api';
import axiosInstance from '../../api/axiosConfig';

// Mock axios instance
jest.mock('../../api/axiosConfig', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should successfully login and return user data with token', async () => {
      const mockResponse = {
        data: {
          access: 'mock-token',
          user: {
            id: 1,
            username: 'testuser',
            role: 'ADMIN'
          }
        }
      };

      (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const credentials = {
        username: 'testuser',
        password: 'password123'
      };

      const result = await authService.login(credentials);

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual({
        user: {
          id: '1',
          username: 'testuser',
          role: 'admin'
        },
        token: 'mock-token'
      });
    });

    it('should throw error on login failure', async () => {
      const errorMessage = 'Invalid credentials';
      (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const credentials = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      await expect(authService.login(credentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should successfully logout', async () => {
      (axiosInstance.get as jest.Mock).mockResolvedValueOnce({});

      await authService.logout();

      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const mockResponse = {
        data: {
          access: 'new-token',
          user: {
            id: 1,
            username: 'testuser',
            role: 'ADMIN'
          }
        }
      };

      (axiosInstance.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.refreshToken();

      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/refresh');
      expect(result).toEqual({
        user: {
          id: '1',
          username: 'testuser',
          role: 'admin'
        },
        token: 'new-token'
      });
    });
  });

  describe('getProfile', () => {
    it('should successfully get user profile', async () => {
      const mockResponse = {
        data: {
          id: 1,
          username: 'testuser',
          role: 'ADMIN'
        }
      };

      (axiosInstance.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.getProfile();

      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/profile');
      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        role: 'admin'
      });
    });
  });
});