export interface StockResponse {
  id: number;
  product: number;
  warehouse: number;
  location: number;
  quantity: number;
}

export interface StockMovement {
  id: number;
  stock: number;
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}

export interface StockAdjustment {
  id: number;
  stock: number;
  adjustment_type: 'ADD' | 'REMOVE';
  quantity: number;
  reason: string;
  approved_by: number;
  timestamp: string;
}

export interface StockFilters {
  product?: number;
  warehouse?: number;
  location?: number;
}

export interface CreateStockData {
  product: number;
  warehouse: number;
  location: number;
  quantity: number;
}

export interface StockMovementData {
  stock: number;
  movement_type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}

export interface StockAdjustmentData {
  stock: number;
  adjustment_type: 'ADD' | 'REMOVE';
  quantity: number;
  reason: string;
  approved_by: number;
}

export interface StockTransferFormData {
  quantity: number;
  targetWarehouse: number;
  targetLocation: number;
  reason: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}