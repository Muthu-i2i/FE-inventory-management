// Product types based on API documentation
export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: number;  // category_id as per API
  supplier: number;  // supplier_id as per API
  warehouse: number; // warehouse_id as per API
  unit_price: number;
  price: number;
}

export interface ProductResponse extends Omit<Product, 'category' | 'supplier' | 'warehouse'> {
  category: Category;
  supplier: Supplier;
  warehouse: Warehouse;
}

export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  email: string;
}

export interface Warehouse {
  id: number;
  name: string;
  capacity: number;
  address: string;
}

export interface Location {
  id: number;
  name: string;
  warehouse: number; // warehouse_id
}

export interface ProductFormData {
  name: string;
  sku: string;
  barcode: string;
  category: number;
  supplier: number;
  warehouse: number;
  unit_price: number;
  price: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}