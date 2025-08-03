import { 
  PaginatedResponse, 
  StockResponse, 
  StockMovement, 
  StockAdjustment, 
  StockFilters, 
  CreateStockData, 
  StockMovementData, 
  StockAdjustmentData,
  MovementType
} from '../types/inventory.types';

const mockStockData: StockResponse[] = [
  {
    id: 1,
    product: {
      id: 1,
      name: 'Product 1'
    },
    warehouse: 1,
    location: 1,
    quantity: 100,
  },
  {
    id: 2,
    product: {
      id: 2,
      name: 'Product 2'
    },
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
      product: {
        id: data.product,
        name: `Product ${data.product}`
      },
      warehouse: data.warehouse,
      location: data.location,
      quantity: data.quantity,
    };
  },

  deleteStock: async (id: number): Promise<void> => {
    return Promise.resolve();
  },

  recordStockMovement: async (data: StockMovementData): Promise<StockMovement> => {
    const now = new Date().toISOString();
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      timestamp: now,
      date: now,
    };
  },

  adjustStock: async (data: StockAdjustmentData): Promise<StockAdjustment> => {
    const now = new Date().toISOString();
    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
      timestamp: now,
      date: now,
    };
  },

  getStockMovements: async (stockId: number): Promise<StockMovement[]> => {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        stock: stockId,
        movement_type: MovementType.INBOUND,
        quantity: 100,
        reason: 'Initial stock',
        timestamp: now,
        date: now,
      },
      {
        id: 2,
        stock: stockId,
        movement_type: MovementType.OUTBOUND,
        quantity: 50,
        reason: 'Sales order',
        timestamp: now,
        date: now,
      },
    ];
  },

  getStockAdjustments: async (stockId: number): Promise<StockAdjustment[]> => {
    const now = new Date().toISOString();
    return [
      {
        id: 1,
        stock: stockId,
        adjustment_type: 'ADD',
        quantity: 10,
        reason: 'Found additional stock',
        approved_by: 1,
        timestamp: now,
        date: now,
      },
    ];
  },
};