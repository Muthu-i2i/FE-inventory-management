# Validation Utilities Documentation

## Form Schemas

### `productSchema`
Validation schema for product forms.

```typescript
export const productSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  
  sku: yup.string()
    .required('SKU is required')
    .matches(/^[A-Z0-9]+$/, 'SKU must be uppercase letters and numbers'),
  
  barcode: yup.string()
    .required('Barcode is required')
    .matches(/^\d+$/, 'Barcode must be numbers only'),
  
  category: yup.number()
    .required('Category is required')
    .positive('Invalid category'),
  
  supplier: yup.number()
    .required('Supplier is required')
    .positive('Invalid supplier'),
  
  warehouse: yup.number()
    .required('Warehouse is required')
    .positive('Invalid warehouse'),
  
  unit_price: yup.number()
    .required('Unit price is required')
    .min(0, 'Unit price must be positive'),
  
  price: yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive')
    .test('price-greater', 'Price must be greater than unit price',
      function(value) {
        return value > this.parent.unit_price;
      }
    ),
});
```

### `stockMovementSchema`
Validation schema for stock movements.

```typescript
export const stockMovementSchema = yup.object().shape({
  quantity: yup.number()
    .required('Quantity is required')
    .positive('Quantity must be positive'),
  
  reason: yup.string()
    .required('Reason is required')
    .min(5, 'Reason must be at least 5 characters'),
  
  reference: yup.string()
    .optional()
    .nullable(),
});
```

## Validation Functions

### `validateSKU`
Validates SKU format and uniqueness.

```typescript
export async function validateSKU(
  sku: string,
  productId?: number
): Promise<boolean> {
  // Check format
  if (!/^[A-Z0-9]+$/.test(sku)) {
    throw new Error('Invalid SKU format');
  }

  // Check uniqueness
  try {
    const response = await axiosInstance.get(`/products/check-sku/${sku}`);
    const exists = response.data.exists;
    
    // Allow same SKU for current product in edit mode
    if (exists && (!productId || response.data.productId !== productId)) {
      throw new Error('SKU already exists');
    }
    
    return true;
  } catch (error) {
    throw error;
  }
}
```

### `validateStockQuantity`
Validates stock quantity for movements.

```typescript
export function validateStockQuantity(
  currentQuantity: number,
  movementQuantity: number,
  movementType: 'IN' | 'OUT'
): boolean {
  if (movementType === 'OUT' && movementQuantity > currentQuantity) {
    throw new Error('Insufficient stock quantity');
  }
  return true;
}
```

## Error Handling Functions

### `handleValidationError`
Processes validation errors for forms.

```typescript
export function handleValidationError(
  error: any,
  setError: UseFormSetError<any>
): void {
  if (error.name === 'ValidationError') {
    // Yup validation error
    error.inner.forEach((err: any) => {
      setError(err.path, {
        type: 'manual',
        message: err.message,
      });
    });
  } else if (error.response?.data?.errors) {
    // API validation error
    Object.entries(error.response.data.errors).forEach(([field, message]) => {
      setError(field, {
        type: 'manual',
        message: Array.isArray(message) ? message[0] : message,
      });
    });
  }
}
```

## Form Helper Functions

### `transformFormData`
Transforms form data for API submission.

```typescript
export function transformFormData<T extends object>(
  data: T,
  options: {
    nullableFields?: (keyof T)[];
    dateFields?: (keyof T)[];
    numberFields?: (keyof T)[];
  } = {}
): Partial<T> {
  const transformed = { ...data };

  // Handle nullable fields
  options.nullableFields?.forEach(field => {
    if (!transformed[field]) {
      transformed[field] = null;
    }
  });

  // Handle date fields
  options.dateFields?.forEach(field => {
    if (transformed[field]) {
      transformed[field] = new Date(transformed[field]).toISOString();
    }
  });

  // Handle number fields
  options.numberFields?.forEach(field => {
    if (transformed[field]) {
      transformed[field] = Number(transformed[field]);
    }
  });

  return transformed;
}
```

## Usage Examples

### Form Validation
```typescript
const { register, handleSubmit, setError } = useForm({
  resolver: yupResolver(productSchema)
});

const onSubmit = async (data: ProductFormData) => {
  try {
    await validateSKU(data.sku, product?.id);
    // Process form submission
  } catch (error) {
    handleValidationError(error, setError);
  }
};
```

### Data Transformation
```typescript
const formData = {
  name: 'Product',
  price: '99.99',
  date: '2024-03-01',
  notes: '',
};

const transformed = transformFormData(formData, {
  nullableFields: ['notes'],
  numberFields: ['price'],
  dateFields: ['date'],
});
```