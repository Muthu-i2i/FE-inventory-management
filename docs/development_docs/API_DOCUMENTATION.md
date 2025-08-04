# API Documentation

## Authentication

### Login
```typescript
POST /auth/login
Body: {
  username: string;
  password: string;
}
Response: {
  access: string;
  user: {
    id: number;
    username: string;
    role: string;
  }
}
```

### Logout
```typescript
GET /auth/logout
Response: 200 OK
```

### Refresh Token
```typescript
GET /auth/refresh
Response: {
  access: string;
  user: {
    id: number;
    username: string;
    role: string;
  }
}
```

## Products

### Get All Products
```typescript
GET /products
Query Parameters:
  - category?: number
  - supplier?: number
  - warehouse?: number
  - search?: string
  - page?: number
  - page_size?: number
Response: {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
```

### Create Product
```typescript
POST /products
Body: {
  name: string;
  sku: string;
  barcode: string;
  category: number;
  supplier: number;
  warehouse: number;
  unit_price: number;
  price: number;
}
Response: Product
```

### Update Product
```typescript
PUT /products/{id}
Body: Partial<Product>
Response: Product
```

### Delete Product
```typescript
DELETE /products/{id}
Response: 204 No Content
```

## Inventory

### Get Stock
```typescript
GET /stock
Response: StockItem[]
```

### Create Stock
```typescript
POST /stock
Body: {
  product: number;
  quantity: number;
  warehouse: number;
  minQuantity: number;
}
Response: StockItem
```

### Record Stock Movement
```typescript
POST /stock/{id}/movement
Body: {
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  reference?: string;
}
Response: StockMovement
```

### Adjust Stock
```typescript
POST /stock/{id}/adjust
Body: {
  new_quantity: number;
  reason: string;
  reference?: string;
}
Response: StockAdjustment
```

## Reports

### Stock Analytics
```typescript
GET /dashboard/analytics
Response: {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockValue: number;
}
```

### Stock Movements
```typescript
GET /dashboard/stock-movements
Query Parameters:
  - timeRange: 'week' | 'month' | 'quarter' | 'year'
Response: {
  date: string;
  inbound: number;
  outbound: number;
}[]
```

### Category Distribution
```typescript
GET /dashboard/category-distribution
Response: {
  category: string;
  value: number;
  quantity: number;
}[]
```

### Top Products
```typescript
GET /dashboard/top-products
Query Parameters:
  - limit?: number
Response: {
  id: number;
  name: string;
  quantity: number;
  value: number;
  turnoverRate: number;
}[]
```

## Error Handling

### Error Response Format
```typescript
{
  status: number;
  message: string;
  errors?: {
    [field: string]: string[];
  };
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Authentication Headers

All authenticated endpoints require:
```typescript
headers: {
  'Authorization': 'Bearer ${token}'
}
```