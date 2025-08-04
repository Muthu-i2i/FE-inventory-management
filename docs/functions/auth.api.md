# Auth API Functions Documentation

## `authService.login`

Authenticates a user and returns user data with access token.

### Parameters
```typescript
credentials: LoginCredentials {
  username: string;
  password: string;
}
```

### Returns
```typescript
Promise<AuthResponse> {
  user: {
    id: string;
    username: string;
    role: string;
  };
  token: string;
}
```

### Error Handling
- Network Error: "Unable to connect to the server"
- 401: "Invalid username or password"
- 403: "Access forbidden"

### Example Usage
```typescript
try {
  const response = await authService.login({
    username: 'admin',
    password: 'admin123'
  });
  // Handle successful login
} catch (error) {
  // Handle error
}
```

## `authService.logout`

Logs out the current user and clears local storage.

### Parameters
None

### Returns
```typescript
Promise<void>
```

### Side Effects
- Clears token from localStorage
- Makes API call to /auth/logout

### Example Usage
```typescript
await authService.logout();
// Redirect to login page
```

## `authService.refreshToken`

Refreshes the current access token.

### Parameters
None

### Returns
```typescript
Promise<AuthResponse>
```

### Error Handling
- Clears token on refresh failure
- Throws error if refresh fails

### Example Usage
```typescript
try {
  const response = await authService.refreshToken();
  // Update token in storage
} catch (error) {
  // Handle refresh failure
}
```

## `authService.getProfile`

Fetches the current user's profile data.

### Parameters
None

### Returns
```typescript
Promise<User> {
  id: string;
  username: string;
  role: string;
}
```

### Example Usage
```typescript
const userProfile = await authService.getProfile();
// Use profile data
```