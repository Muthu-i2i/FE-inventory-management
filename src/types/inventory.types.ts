export interface StockResponse {
  id: number;
  product: {
    id: number;
    name: string;
  };
  warehouse: number;
  location: number;
  quantity: number;
}

export enum MovementType {
  INBOUND = 'IN',
  OUTBOUND = 'OUT'
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface StockMovement {
  id: number;
  stock: number;
  movement_type: MovementType;
  quantity: number;
  reason: string;
  timestamp: string;
  date: string;
  reference?: string;
}

export interface StockAdjustment {
  id: number;
  stock: number;
  adjustment_type: 'ADD' | 'REMOVE';
  quantity: number;
  reason: string;
  approved_by: number;
  timestamp: string;
  date: string;
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
  movement_type: MovementType;
  quantity: number;
  reason: string;
  reference?: string;
}

export interface StockAdjustmentData {
  stock: number;
  adjustment_type: 'ADD' | 'REMOVE';
  quantity: number;
  reason: string;
  approved_by: number;
  reference?: string;
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

export interface StockItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  warehouse: number;
  location: number;
  quantity: number;
}

export interface StockMovementFormData {
  quantity: number;
  reason: string;
  reference?: string;
}

export interface StockAdjustmentFormData {
  new_quantity: number;
  reason: string;
  reference?: string;
}