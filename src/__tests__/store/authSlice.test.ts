import authReducer, { login, logout } from '../../store/slices/authSlice';
import { mockAuthService } from '../../mocks/mockAuthService';

// Mock the auth service
jest.mock('../../mocks/mockAuthService', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('login', () => {
    it('should handle login.pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: true,
        error: null,
      });
    });

    it('should handle login.fulfilled', () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        role: 'admin',
      };
      const mockToken = 'test-token';

      const action = {
        type: login.fulfilled.type,
        payload: { user: mockUser, token: mockToken },
      };

      const state = authReducer(initialState, action);

      expect(state).toEqual({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    });

    it('should handle login.rejected', () => {
      const errorMessage = 'Invalid credentials';
      const action = {
        type: login.rejected.type,
        error: { message: errorMessage },
      };

      const state = authReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        isLoading: false,
        error: errorMessage,
      });
    });
  });

  describe('logout', () => {
    it('should handle logout.fulfilled', () => {
      const initialStateWithUser = {
        user: { id: '1', username: 'testuser', role: 'admin' },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

      const action = { type: logout.fulfilled.type };
      const state = authReducer(initialStateWithUser, action);

      expect(state).toEqual({
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
      });
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error',
      };

      const state = authReducer(stateWithError, { type: 'auth/clearError' });

      expect(state.error).toBeNull();
    });
  });
});