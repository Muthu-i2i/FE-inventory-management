import { Supplier, CreateSupplierData, UpdateSupplierData, SupplierFilters } from '../types/supplier.types';
import { PaginatedResponse } from '../types/inventory.types';

const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Tech Supplies Inc.',
    email: 'contact@techsupplies.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA',
    contactPerson: 'John Smith',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Global Electronics',
    email: 'info@globalelectronics.com',
    phone: '+1-555-0124',
    address: '456 Electronics Ave, New York, NY',
    contactPerson: 'Jane Doe',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'Office Solutions',
    email: 'sales@officesolutions.com',
    phone: '+1-555-0125',
    address: '789 Office Park, Chicago, IL',
    contactPerson: 'Mike Johnson',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockSupplierService = {
  getSuppliers: async (
    filters: SupplierFilters = {},
    page = 1,
    page_size = 10
  ): Promise<PaginatedResponse<Supplier>> => {
    await delay(500);

    let filteredSuppliers = [...mockSuppliers];

    if (filters.status) {
      filteredSuppliers = filteredSuppliers.filter(s => s.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.contactPerson?.toLowerCase().includes(searchLower)
      );
    }

    return {
      count: filteredSuppliers.length,
      next: null,
      previous: null,
      results: filteredSuppliers,
    };
  },

  getSupplierById: async (id: number): Promise<Supplier> => {
    await delay(300);
    
    const supplier = mockSuppliers.find(s => s.id === id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    return supplier;
  },

  createSupplier: async (data: CreateSupplierData): Promise<Supplier> => {
    await delay(500);

    const newSupplier: Supplier = {
      id: Math.max(...mockSuppliers.map(s => s.id)) + 1,
      ...data,
      createdAt: new Date().toISOString(),
    };

    mockSuppliers.push(newSupplier);
    return newSupplier;
  },

  updateSupplier: async (id: number, data: UpdateSupplierData): Promise<Supplier> => {
    await delay(500);

    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }

    const updatedSupplier = {
      ...mockSuppliers[index],
      ...data,
    };

    mockSuppliers[index] = updatedSupplier;
    return updatedSupplier;
  },

  deleteSupplier: async (id: number): Promise<void> => {
    await delay(500);

    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }

    mockSuppliers.splice(index, 1);
  },
};