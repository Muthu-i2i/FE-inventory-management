import {
  StockAnalytics,
  StockMovementTrend,
  CategoryDistribution,
  WarehouseDistribution,
  TopProduct,
  StockAlert,
  OrderSummary,
  TimeRange,
} from '../types/report.types';

const generateDailyData = (days: number) => {
  const data: StockMovementTrend[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      inbound: Math.floor(Math.random() * 50) + 10,
      outbound: Math.floor(Math.random() * 40) + 5,
    });
  }
  
  return data;
};

export const mockReportService = {
  getStockAnalytics: async (): Promise<StockAnalytics> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalProducts: 150,
      totalStock: 2500,
      lowStockItems: 12,
      outOfStockItems: 5,
      stockValue: 175000,
    };
  },

  getStockMovements: async (timeRange: TimeRange): Promise<StockMovementTrend[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const daysMap: Record<TimeRange, number> = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
      custom: 30, // Default to 30 days for custom range
    };

    return generateDailyData(daysMap[timeRange]);
  },

  getCategoryDistribution: async (): Promise<CategoryDistribution[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { category: 'Electronics', value: 50000, quantity: 500 },
      { category: 'Furniture', value: 35000, quantity: 200 },
      { category: 'Office Supplies', value: 25000, quantity: 1000 },
      { category: 'Accessories', value: 15000, quantity: 800 },
      { category: 'Others', value: 10000, quantity: 300 },
    ];
  },

  getWarehouseDistribution: async (): Promise<WarehouseDistribution[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { warehouse: 'Main Warehouse', value: 80000, quantity: 1200 },
      { warehouse: 'East Coast', value: 45000, quantity: 800 },
      { warehouse: 'West Coast', value: 35000, quantity: 600 },
      { warehouse: 'Central', value: 25000, quantity: 400 },
    ];
  },

  getTopProducts: async (limit: number = 10): Promise<TopProduct[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { id: 1, name: 'Laptop', quantity: 50, value: 50000, turnoverRate: 4.5 },
      { id: 2, name: 'Office Chair', quantity: 100, value: 25000, turnoverRate: 3.2 },
      { id: 3, name: 'Desk', quantity: 75, value: 22500, turnoverRate: 2.8 },
      { id: 4, name: 'Monitor', quantity: 80, value: 20000, turnoverRate: 3.9 },
      { id: 5, name: 'Keyboard', quantity: 150, value: 7500, turnoverRate: 4.2 },
    ].slice(0, limit);
  },

  getStockAlerts: async (): Promise<StockAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { id: 1, product: 'Laptop', currentStock: 5, minRequired: 20, warehouse: 'Main Warehouse', status: 'low' },
      { id: 2, product: 'Mouse', currentStock: 0, minRequired: 50, warehouse: 'East Coast', status: 'out' },
      { id: 3, product: 'Desk', currentStock: 8, minRequired: 15, warehouse: 'West Coast', status: 'low' },
      { id: 4, product: 'Chair', currentStock: 0, minRequired: 25, warehouse: 'Central', status: 'out' },
    ];
  },

  getOrderSummary: async (timeRange: TimeRange): Promise<OrderSummary> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      totalOrders: 125,
      pendingOrders: 15,
      completedOrders: 110,
      totalValue: 250000,
    };
  },

  exportReport: async (format: 'csv' | 'excel' | 'pdf'): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock file content
    const content = 'Report Data...';
    const blob = new Blob([content], { type: 'text/plain' });
    return blob;
  },
};