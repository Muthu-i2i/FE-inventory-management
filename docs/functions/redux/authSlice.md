# Auth Slice Documentation

## State Interface
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

## Initial State
```typescript
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};
```

## Thunk Actions

### `login`
```typescript
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('token', response.token);
    return response;
  }
);
```

### `logout`
```typescript
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
    localStorage.removeItem('token');
  }
);
```

## Reducers

### Regular Reducers
```typescript
reducers: {
  clearError: (state) => {
    state.error = null;
  },
},
```

### Extra Reducers
```typescript
extraReducers: (builder) => {
  // Login
  builder.addCase(login.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  });
  builder.addCase(login.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.token = action.payload.token;
  });
  builder.addCase(login.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.error.message || 'Login failed';
  });

  // Logout
  builder.addCase(logout.fulfilled, (state) => {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
  });
},
```

## Selectors

### `selectAuth`
```typescript
export const selectAuth = (state: RootState) => state.auth;
```

### `selectUser`
```typescript
export const selectUser = (state: RootState) => state.auth.user;
```

### `selectIsAuthenticated`
```typescript
export const selectIsAuthenticated = (state: RootState) => 
  state.auth.isAuthenticated;
```

## Usage Examples

### In Components
```typescript
// Using hooks
const dispatch = useDispatch();
const { user, isLoading } = useSelector(selectAuth);

// Login
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    await dispatch(login(credentials)).unwrap();
    // Handle success
  } catch (error) {
    // Handle error
  }
};

// Logout
const handleLogout = async () => {
  await dispatch(logout());
  // Handle logout completion
};
```

### With TypeScript
```typescript
// Action types
type LoginAction = ReturnType<typeof login>;
type LogoutAction = ReturnType<typeof logout>;

// Thunk result
type LoginResult = Awaited<ReturnType<typeof login.fulfilled>>;
```

## Error Handling
```typescript
try {
  await dispatch(login(credentials)).unwrap();
  navigate('/dashboard');
} catch (error) {
  enqueueSnackbar(error.message || 'Login failed', { 
    variant: 'error' 
  });
}
```

## Side Effects
- Stores token in localStorage on successful login
- Removes token from localStorage on logout
- Redirects to login page on authentication failure
- Updates global authentication state

## Related Files
- `src/api/auth.api.ts`
- `src/types/auth.types.ts`
- `src/pages/auth/Login.tsx`
- `src/components/ProtectedRoute.tsx`