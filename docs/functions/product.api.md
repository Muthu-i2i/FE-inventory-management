# Product API Functions Documentation

## `productService.getProducts`

Fetches products with optional filtering and pagination.

### Parameters
```typescript
filters?: ProductFilters {
  category?: number;
  supplier?: number;
  warehouse?: number;
  search?: string;
}
page?: number;
page_size?: number;
```

### Returns
```typescript
Promise<PaginatedResponse<Product>> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
```

### Example Usage
```typescript
// Get all products
const allProducts = await productService.getProducts();

// Get filtered products
const filteredProducts = await productService.getProducts({
  category: 1,
  search: 'laptop'
}, 1, 10);
```

## `productService.createProduct`

Creates a new product.

### Parameters
```typescript
data: Omit<Product, 'id'> {
  name: string;
  sku: string;
  barcode: string;
  category: number;
  supplier: number;
  warehouse: number;
  unit_price: number;
  price: number;
}
```

### Returns
```typescript
Promise<Product>
```

### Validation
- SKU must be unique
- Prices must be non-negative
- Category, supplier, and warehouse must exist

### Example Usage
```typescript
const newProduct = await productService.createProduct({
  name: 'New Laptop',
  sku: 'LAP001',
  barcode: '123456789',
  category: 1,
  supplier: 1,
  warehouse: 1,
  unit_price: 800,
  price: 999
});
```

## `productService.updateProduct`

Updates an existing product.

### Parameters
```typescript
id: number;
data: Partial<Product>;
```

### Returns
```typescript
Promise<Product>
```

### Example Usage
```typescript
const updatedProduct = await productService.updateProduct(1, {
  price: 899,
  unit_price: 750
});
```

## `productService.deleteProduct`

Deletes a product.

### Parameters
```typescript
id: number;
```

### Returns
```typescript
Promise<void>
```

### Validation
- Cannot delete product with existing stock
- Cannot delete product with pending orders

### Example Usage
```typescript
await productService.deleteProduct(1);
```

## `productService.getCategories`

Fetches all product categories.

### Returns
```typescript
Promise<Category[]>
```

### Example Usage
```typescript
const categories = await productService.getCategories();
```

## `productService.getSuppliers`

Fetches all suppliers.

### Returns
```typescript
Promise<Supplier[]>
```

### Example Usage
```typescript
const suppliers = await productService.getSuppliers();
```

## `productService.getWarehouses`

Fetches all warehouses.

### Returns
```typescript
Promise<Warehouse[]>
```

### Example Usage
```typescript
const warehouses = await productService.getWarehouses();
```