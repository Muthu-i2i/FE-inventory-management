export type PurchaseOrderStatus = 'draft' | 'open' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  id: number;
  product: number;
  productName: string; // For display purposes
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplier: number;
  supplierName: string; // For display purposes
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
}

export interface CreatePurchaseOrderData {
  supplier: number;
  items: Array<{
    product: number;
    quantity: number;
    unit_price: number;
  }>;
  notes?: string;
  expectedDeliveryDate?: string;
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

export interface UpdatePurchaseOrderData extends Partial<CreatePurchaseOrderData> {
  status?: PurchaseOrderStatus;
}

export interface PurchaseOrderFilters {
  supplier?: number;
  status?: PurchaseOrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
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