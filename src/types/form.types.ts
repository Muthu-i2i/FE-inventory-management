import { MovementType } from './inventory.types';

export interface StockMovementFormData {
  quantity: number;
  reason: string;
  reference?: string;
  type?: MovementType;
}

export interface StockAdjustmentFormData {
  new_quantity: number;
  reason: string;
  reference?: string;
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

export interface PurchaseOrderFormData {
  supplier: number;
  items: Array<{
    product: number;
    quantity: number;
    unit_price: number;
  }>;
  notes: string | null;
  expectedDeliveryDate: string | null;
}

export interface SupplierFormData {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  contactPerson: string | null;
  status: 'active' | 'inactive';
}