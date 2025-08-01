import { PaginatedResponse } from '../types/inventory.types';

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: number;
  supplier: number;
  warehouse: number;
  unit_price: number;
  price: number;
}

interface ProductFilters {
  category?: number;
  supplier?: number;
  warehouse?: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    sku: 'LAP001',
    barcode: '123456789',
    category: 1,
    supplier: 1,
    warehouse: 1,
    unit_price: 800,
    price: 999,
  },
  {
    id: 2,
    name: 'Mouse',
    sku: 'MOU001',
    barcode: '987654321',
    category: 1,
    supplier: 1,
    warehouse: 1,
    unit_price: 15,
    price: 24.99,
  },
  {
    id: 3,
    name: 'Keyboard',
    sku: 'KEY001',
    barcode: '456789123',
    category: 1,
    supplier: 2,
    warehouse: 1,
    unit_price: 40,
    price: 59.99,
  },
];

export const mockProductService = {
  getProducts: async (
    filters: ProductFilters,
    page = 1,
    page_size = 10
  ): Promise<PaginatedResponse<Product>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      count: mockProducts.length,
      next: null,
      previous: null,
      results: mockProducts,
    };
  },

  createProduct: async (data: Omit<Product, 'id'>): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: Math.floor(Math.random() * 1000),
      ...data,
    };
  },

  updateProduct: async (
    id: number,
    data: Partial<Product>
  ): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      ...product,
      ...data,
    };
  },

  deleteProduct: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In a real app, this would remove the product from the database
    return Promise.resolve();
  },
};