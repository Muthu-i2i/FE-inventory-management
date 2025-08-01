export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateSupplierData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  status: 'active' | 'inactive';
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {}

export interface SupplierFilters {
  status?: 'active' | 'inactive';
  search?: string;
}