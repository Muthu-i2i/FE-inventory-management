import { 
  PurchaseOrder, 
  CreatePurchaseOrderData, 
  UpdatePurchaseOrderData, 
  PurchaseOrderFilters,
  PurchaseOrderStatus 
} from '../types/purchase-order.types';
import { PaginatedResponse } from '../types/inventory.types';

const generateOrderNumber = () => {
  return `PO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    orderNumber: 'PO-0001',
    supplier: 1,
    supplierName: 'Tech Supplies Inc.',
    status: 'open',
    items: [
      {
        id: 1,
        product: 1,
        productName: 'Laptop',
        quantity: 5,
        unit_price: 800,
        total: 4000,
      },
      {
        id: 2,
        product: 2,
        productName: 'Mouse',
        quantity: 10,
        unit_price: 15,
        total: 150,
      },
    ],
    totalAmount: 4150,
    notes: 'Urgent order for new office setup',
    createdAt: '2024-01-15T10:00:00Z',
    expectedDeliveryDate: '2024-01-22T10:00:00Z',
  },
  {
    id: 2,
    orderNumber: 'PO-0002',
    supplier: 2,
    supplierName: 'Global Electronics',
    status: 'received',
    items: [
      {
        id: 3,
        product: 3,
        productName: 'Keyboard',
        quantity: 15,
        unit_price: 40,
        total: 600,
      },
    ],
    totalAmount: 600,
    createdAt: '2024-01-10T09:00:00Z',
    expectedDeliveryDate: '2024-01-17T09:00:00Z',
    receivedDate: '2024-01-16T14:30:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPurchaseOrderService = {
  getPurchaseOrders: async (
    filters: PurchaseOrderFilters = {},
    page = 1,
    page_size = 10
  ): Promise<PaginatedResponse<PurchaseOrder>> => {
    await delay(500);

    let filteredOrders = [...mockPurchaseOrders];

    if (filters.supplier) {
      filteredOrders = filteredOrders.filter(po => po.supplier === filters.supplier);
    }

    if (filters.status) {
      filteredOrders = filteredOrders.filter(po => po.status === filters.status);
    }

    if (filters.dateFrom) {
      filteredOrders = filteredOrders.filter(
        po => new Date(po.createdAt) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      filteredOrders = filteredOrders.filter(
        po => new Date(po.createdAt) <= new Date(filters.dateTo!)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        po =>
          po.orderNumber.toLowerCase().includes(searchLower) ||
          po.supplierName.toLowerCase().includes(searchLower)
      );
    }

    return {
      count: filteredOrders.length,
      next: null,
      previous: null,
      results: filteredOrders,
    };
  },

  getPurchaseOrderById: async (id: number): Promise<PurchaseOrder> => {
    await delay(300);
    
    const order = mockPurchaseOrders.find(po => po.id === id);
    if (!order) {
      throw new Error('Purchase order not found');
    }

    return order;
  },

  createPurchaseOrder: async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
    await delay(500);

    const supplier = mockPurchaseOrders.find(po => po.supplier === data.supplier);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    const items = data.items.map((item, index) => ({
      id: Math.floor(Math.random() * 1000),
      product: item.product,
      productName: `Product ${item.product}`, // In real app, get from product service
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const newOrder: PurchaseOrder = {
      id: Math.max(...mockPurchaseOrders.map(po => po.id)) + 1,
      orderNumber: generateOrderNumber(),
      supplier: data.supplier,
      supplierName: supplier.supplierName,
      status: 'draft',
      items,
      totalAmount,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: data.expectedDeliveryDate,
    };

    mockPurchaseOrders.push(newOrder);
    return newOrder;
  },

  updatePurchaseOrder: async (
    id: number,
    data: UpdatePurchaseOrderData
  ): Promise<PurchaseOrder> => {
    await delay(500);

    const index = mockPurchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }

    const currentOrder = mockPurchaseOrders[index];

    // Don't allow updates to received orders
    if (currentOrder.status === 'received' && data.status !== 'received') {
      throw new Error('Cannot update a received purchase order');
    }

    let updatedItems = currentOrder.items;
    let totalAmount = currentOrder.totalAmount;

    if (data.items) {
      updatedItems = data.items.map(item => ({
        id: Math.floor(Math.random() * 1000),
        product: item.product,
        productName: `Product ${item.product}`, // In real app, get from product service
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      }));
      totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
    }

    const updatedOrder = {
      ...currentOrder,
      ...data,
      items: updatedItems,
      totalAmount,
      receivedDate: data.status === 'received' ? new Date().toISOString() : currentOrder.receivedDate,
    };

    mockPurchaseOrders[index] = updatedOrder;
    return updatedOrder;
  },

  deletePurchaseOrder: async (id: number): Promise<void> => {
    await delay(500);

    const index = mockPurchaseOrders.findIndex(po => po.id === id);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }

    const order = mockPurchaseOrders[index];
    if (order.status !== 'draft') {
      throw new Error('Can only delete draft purchase orders');
    }

    mockPurchaseOrders.splice(index, 1);
  },

  receivePurchaseOrder: async (id: number): Promise<PurchaseOrder> => {
    await delay(500);

    const order = await mockPurchaseOrderService.getPurchaseOrderById(id);
    if (order.status !== 'open') {
      throw new Error('Can only receive open purchase orders');
    }

    return mockPurchaseOrderService.updatePurchaseOrder(id, {
      status: 'received',
    });
  },
};