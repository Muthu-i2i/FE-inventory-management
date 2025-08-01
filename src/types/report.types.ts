export interface StockAnalytics {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockValue: number;
}

export interface StockMovementTrend {
  date: string;
  inbound: number;
  outbound: number;
}

export interface CategoryDistribution {
  category: string;
  value: number;
  quantity: number;
}

export interface WarehouseDistribution {
  warehouse: string;
  value: number;
  quantity: number;
}

export interface TopProduct {
  id: number;
  name: string;
  quantity: number;
  value: number;
  turnoverRate: number;
}

export interface StockAlert {
  id: number;
  product: string;
  currentStock: number;
  minRequired: number;
  warehouse: string;
  status: 'low' | 'out';
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalValue: number;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';