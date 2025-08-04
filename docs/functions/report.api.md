# Report API Functions Documentation

## `reportService.getStockAnalytics`

Fetches overall stock analytics data.

### Returns
```typescript
Promise<StockAnalytics> {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockValue: number;
}
```

### Example Usage
```typescript
const analytics = await reportService.getStockAnalytics();
console.log(`Total stock value: $${analytics.stockValue}`);
```

## `reportService.getStockMovements`

Fetches stock movement trends over time.

### Parameters
```typescript
timeRange: TimeRange // 'week' | 'month' | 'quarter' | 'year'
```

### Returns
```typescript
Promise<StockMovementTrend[]> {
  date: string;
  inbound: number;
  outbound: number;
}[]
```

### Example Usage
```typescript
const movements = await reportService.getStockMovements('week');
// Use for trend charts
```

## `reportService.getCategoryDistribution`

Fetches product distribution by category.

### Returns
```typescript
Promise<CategoryDistribution[]> {
  category: string;
  value: number;
  quantity: number;
}[]
```

### Example Usage
```typescript
const distribution = await reportService.getCategoryDistribution();
// Use for pie charts
```

## `reportService.getWarehouseDistribution`

Fetches stock distribution by warehouse.

### Returns
```typescript
Promise<WarehouseDistribution[]> {
  warehouse: string;
  value: number;
  quantity: number;
}[]
```

### Example Usage
```typescript
const distribution = await reportService.getWarehouseDistribution();
// Use for warehouse analytics
```

## `reportService.getTopProducts`

Fetches top-performing products.

### Parameters
```typescript
limit?: number = 10
```

### Returns
```typescript
Promise<TopProduct[]> {
  id: number;
  name: string;
  quantity: number;
  value: number;
  turnoverRate: number;
}[]
```

### Example Usage
```typescript
const topProducts = await reportService.getTopProducts(5);
// Display in dashboard
```

## `reportService.getStockAlerts`

Fetches low stock and out-of-stock alerts.

### Returns
```typescript
Promise<StockAlert[]> {
  id: number;
  product: string;
  currentStock: number;
  minRequired: number;
  warehouse: string;
  status: 'low' | 'out';
}[]
```

### Example Usage
```typescript
const alerts = await reportService.getStockAlerts();
// Show in notifications
```

## `reportService.getOrderSummary`

Fetches order summary for a time period.

### Parameters
```typescript
timeRange: TimeRange // 'week' | 'month' | 'quarter' | 'year'
```

### Returns
```typescript
Promise<OrderSummary> {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalValue: number;
}
```

### Example Usage
```typescript
const summary = await reportService.getOrderSummary('month');
// Display in reports
```

## `reportService.exportReport`

Exports report data in various formats.

### Parameters
```typescript
format: 'csv' | 'excel' | 'pdf'
```

### Returns
```typescript
Promise<Blob>
```

### Example Usage
```typescript
const blob = await reportService.exportReport('excel');
// Create download link
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'report.xlsx';
a.click();
```