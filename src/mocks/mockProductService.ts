import { 
  Product, 
  ProductFilters, 
  PaginatedResponse,
  Category,
  Supplier,
  Warehouse
} from '../types/product.types';

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

const mockCategories: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Furniture' },
  { id: 3, name: 'Office Supplies' },
  { id: 4, name: 'Accessories' },
];

const mockSuppliers: Supplier[] = [
  { id: 1, name: 'Tech Supplies Inc.', email: 'tech@supplies.com' },
  { id: 2, name: 'Office Solutions Ltd.', email: 'office@solutions.com' },
  { id: 3, name: 'Global Electronics', email: 'global@electronics.com' },
];

const mockWarehouses: Warehouse[] = [
  { 
    id: 1, 
    name: 'Main Warehouse',
    capacity: 10000,
    address: '123 Main St, City'
  },
  { 
    id: 2, 
    name: 'East Coast',
    capacity: 5000,
    address: '456 East Ave, Coast City'
  },
  { 
    id: 3, 
    name: 'West Coast',
    capacity: 5000,
    address: '789 West Blvd, Coast City'
  },
  { 
    id: 4, 
    name: 'Central',
    capacity: 3000,
    address: '321 Central Rd, Middle City'
  },
];

export const mockProductService = {
  getProducts: async (
    filters?: ProductFilters,
    page = 1,
    page_size = 10
  ): Promise<PaginatedResponse<Product>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters.supplier) {
        filteredProducts = filteredProducts.filter(p => p.supplier === filters.supplier);
      }
      if (filters.warehouse) {
        filteredProducts = filteredProducts.filter(p => p.warehouse === filters.warehouse);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.barcode.toLowerCase().includes(searchLower)
        );
      }
    }

    return {
      count: filteredProducts.length,
      next: null,
      previous: null,
      results: filteredProducts,
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

  getCategories: async (): Promise<Category[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCategories;
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockSuppliers;
  },

  getWarehouses: async (): Promise<Warehouse[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockWarehouses;
  },
};