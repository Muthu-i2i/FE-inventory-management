# Inventory API Functions Documentation

## `inventoryService.getStock`

Fetches all stock items with optional filtering.

### Parameters
```typescript
filters?: {
  product?: number;
  warehouse?: number;
  lowStock?: boolean;
}
```

### Returns
```typescript
Promise<StockItem[]>
```

### Example Usage
```typescript
// Get all stock
const allStock = await inventoryService.getStock();

// Get low stock items
const lowStock = await inventoryService.getStock({ lowStock: true });
```

## `inventoryService.createStock`

Creates a new stock entry.

### Parameters
```typescript
data: {
  product: number;
  warehouse: number;
  quantity: number;
  minQuantity: number;
}
```

### Returns
```typescript
Promise<StockItem>
```

### Validation
- Quantity must be non-negative
- Product and warehouse must exist
- MinQuantity must be non-negative

### Example Usage
```typescript
const newStock = await inventoryService.createStock({
  product: 1,
  warehouse: 1,
  quantity: 100,
  minQuantity: 10
});
```

## `inventoryService.recordStockMovement`

Records a stock movement (in/out).

### Parameters
```typescript
stockId: number;
data: {
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  reference?: string;
}
```

### Returns
```typescript
Promise<StockMovement>
```

### Validation
- Quantity must be positive
- Cannot remove more than available quantity
- Reason is required

### Example Usage
```typescript
const movement = await inventoryService.recordStockMovement(1, {
  movement_type: 'IN',
  quantity: 50,
  reason: 'Restock',
  reference: 'PO-123'
});
```

## `inventoryService.adjustStock`

Adjusts stock quantity with reason.

### Parameters
```typescript
stockId: number;
data: {
  new_quantity: number;
  reason: string;
  reference?: string;
}
```

### Returns
```typescript
Promise<StockAdjustment>
```

### Validation
- New quantity must be non-negative
- Reason is required

### Example Usage
```typescript
const adjustment = await inventoryService.adjustStock(1, {
  new_quantity: 75,
  reason: 'Physical count adjustment',
  reference: 'ADJ-123'
});
```

## `inventoryService.getStockMovements`

Fetches stock movement history.

### Parameters
```typescript
stockId: number;
filters?: {
  startDate?: string;
  endDate?: string;
  type?: 'IN' | 'OUT';
}
```

### Returns
```typescript
Promise<StockMovement[]>
```

### Example Usage
```typescript
const movements = await inventoryService.getStockMovements(1, {
  startDate: '2024-01-01',
  type: 'IN'
});
```

## `inventoryService.getStockAdjustments`

Fetches stock adjustment history.

### Parameters
```typescript
stockId: number;
filters?: {
  startDate?: string;
  endDate?: string;
}
```

### Returns
```typescript
Promise<StockAdjustment[]>
```

### Example Usage
```typescript
const adjustments = await inventoryService.getStockAdjustments(1, {
  startDate: '2024-01-01'
});
```