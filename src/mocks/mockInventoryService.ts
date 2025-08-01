import { PaginatedResponse, StockResponse, StockMovement, StockAdjustment, StockFilters, CreateStockData, StockMovementData, StockAdjustmentData } from '../types/inventory.types';

const mockStockData: StockResponse[] = [
  {
    id: 1,
    product: 1,
    warehouse: 1,
    location: 1,
    quantity: 100,
  },
  {
    id: 2,
    product: 2,
    warehouse: 1,
    location: 2,
    quantity: 50,
  },
];

export const mockInventoryService = {
  getStock: async (filters: StockFilters, page = 1, page_size = 10): Promise<PaginatedResponse<StockResponse>> => {
    return {
      count: mockStockData.length,
      next: null,
      previous: null,
      results: mockStockData,
    };
  },

  createStock: async (data: CreateStockData): Promise<StockResponse> => {
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
    };
  },

  deleteStock: async (id: number): Promise<void> => {
    return Promise.resolve();
  },

  recordStockMovement: async (data: StockMovementData): Promise<StockMovement> => {
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      timestamp: new Date().toISOString(),
    };
  },

  adjustStock: async (data: StockAdjustmentData): Promise<StockAdjustment> => {
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      timestamp: new Date().toISOString(),
    };
  },

  getStockMovements: async (stockId: number): Promise<StockMovement[]> => {
    return [
      {
        id: 1,
        stock: stockId,
        movement_type: 'IN',
        quantity: 100,
        reason: 'Initial stock',
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        stock: stockId,
        movement_type: 'OUT',
        quantity: 50,
        reason: 'Sales order',
        timestamp: new Date().toISOString(),
      },
    ];
  },

  getStockAdjustments: async (stockId: number): Promise<StockAdjustment[]> => {
    return [
      {
        id: 1,
        stock: stockId,
        adjustment_type: 'ADD',
        quantity: 10,
        reason: 'Found additional stock',
        approved_by: 1,
        timestamp: new Date().toISOString(),
      },
    ];
  },
};