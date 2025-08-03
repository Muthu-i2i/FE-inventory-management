export type SupplierStatus = 'active' | 'inactive';

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
  status: SupplierStatus;
  createdAt: string;
}

export interface CreateSupplierData {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
  status: SupplierStatus;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {}

export interface SupplierFilters {
  status?: SupplierStatus;
  search?: string;
}

export interface SupplierFormData {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
  status: SupplierStatus;
}