# Frontend Architecture Documentation

## Overview

The frontend is built using a modern React architecture with TypeScript, emphasizing type safety, component reusability, and maintainable state management.

## Core Technologies

### React + TypeScript
- Functional components with hooks
- Strong type checking
- Interface-driven development

### State Management
- Redux Toolkit for global state
- React Context for theme and auth
- Local component state with useState

### UI Framework
- Material-UI (MUI) v5
- Custom theme configuration
- Responsive design patterns

## Project Structure

```
src/
├── api/                 # API service layer
│   ├── auth.api.ts
│   ├── inventory.api.ts
│   ├── product.api.ts
│   └── axiosConfig.ts
│
├── components/          # Reusable components
│   ├── common/         # Shared components
│   │   ├── PageContainer.tsx
│   │   └── DeleteConfirmDialog.tsx
│   └── Layout.tsx
│
├── context/            # React Context providers
│   └── AuthContext.tsx
│
├── features/           # Feature-specific components
│   ├── inventory/
│   ├── products/
│   └── reports/
│
├── mocks/              # Mock services
│   ├── mockData.ts
│   └── mockServices.ts
│
├── pages/              # Page components
│   ├── auth/
│   ├── dashboard/
│   └── inventory/
│
├── store/              # Redux store
│   ├── slices/
│   └── store.ts
│
├── theme/              # MUI theme
│   └── theme.ts
│
├── types/              # TypeScript types
│   ├── auth.types.ts
│   └── inventory.types.ts
│
└── utils/              # Utility functions
```

## Component Architecture

### Component Patterns

1. **Page Components**
```typescript
const PageComponent: React.FC = () => {
  // Data fetching
  const { data, loading } = useQuery();

  // Event handlers
  const handleAction = () => {
    // Implementation
  };

  return (
    <PageContainer>
      {loading ? <Loading /> : <Content />}
    </PageContainer>
  );
};
```

2. **Form Components**
```typescript
const FormComponent: React.FC<FormProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<FormData>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

3. **Dialog Components**
```typescript
const DialogComponent: React.FC<DialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {/* Dialog content */}
    </Dialog>
  );
};
```

## State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  inventory: InventoryState;
  products: ProductState;
}

// Example slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducers
  },
  extraReducers: (builder) => {
    // Async reducers
  },
});
```

### Context Usage
```typescript
const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider: React.FC = ({ children }) => {
  // Context logic
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## API Integration

### Service Layer Pattern
```typescript
export const serviceLayer = {
  getData: async (): Promise<Data> => {
    const response = await axiosInstance.get('/endpoint');
    return response.data;
  },
  // Other methods
};
```

### Error Handling
```typescript
try {
  const data = await serviceLayer.getData();
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  }
  // Handle other errors
}
```

## Form Handling

### Form Pattern with Validation
```typescript
const schema = yup.object().shape({
  field: yup.string().required(),
});

const Form: React.FC = () => {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField {...register('field')} />
    </form>
  );
};
```

## Testing Strategy

### Component Testing
```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### Service Testing
```typescript
describe('Service', () => {
  it('handles API call', async () => {
    const response = await service.method();
    expect(response).toEqual(expectedData);
  });
});
```

## Performance Considerations

1. **Code Splitting**
```typescript
const LazyComponent = React.lazy(() => import('./Component'));
```

2. **Memoization**
```typescript
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computeValue(), [deps]);
```

3. **Debouncing**
```typescript
const debouncedSearch = useCallback(
  debounce((term) => {
    // Search logic
  }, 300),
  []
);
```

## Deployment Configuration

### Vercel Configuration
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Environment Configuration

### Environment Variables
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_VERSION=$npm_package_version
```

### Feature Flags
```typescript
const FEATURES = {
  NEW_DASHBOARD: process.env.REACT_APP_FEATURE_NEW_DASHBOARD === 'true',
};
```