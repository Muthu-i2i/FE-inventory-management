# ProductForm Component Documentation

## Component Overview
`ProductForm` handles creation and editing of products with validation and dynamic data loading.

## Props Interface
```typescript
interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isDialog?: boolean;
}
```

## Form Schema
```typescript
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  sku: yup.string().required('SKU is required'),
  barcode: yup.string().required('Barcode is required'),
  category: yup.number().required('Category is required'),
  supplier: yup.number().required('Supplier is required'),
  warehouse: yup.number().required('Warehouse is required'),
  unit_price: yup.number()
    .min(0, 'Unit price must be positive')
    .required('Unit price is required'),
  price: yup.number()
    .min(0, 'Price must be positive')
    .required('Price is required'),
});
```

## Internal Functions

### `useProductForm` (Custom Hook)
```typescript
function useProductForm(product?: Product) {
  return {
    categories: Category[];
    suppliers: Supplier[];
    warehouses: Warehouse[];
    loading: boolean;
    error: string | null;
  }
}
```

### `handleSubmit`
```typescript
async function handleSubmit(data: ProductFormData): Promise<void>
```
Processes form submission with validation.

### `loadFormData`
```typescript
async function loadFormData(): Promise<void>
```
Loads categories, suppliers, and warehouses data.

## Form State Management
```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
  setValue,
  watch,
} = useForm<ProductFormData>({
  resolver: yupResolver(schema),
  defaultValues: product || {
    unit_price: 0,
    price: 0,
  },
});
```

## Field Components

### `NameField`
```typescript
function NameField(): JSX.Element {
  return (
    <TextField
      {...register('name')}
      label="Product Name"
      error={!!errors.name}
      helperText={errors.name?.message}
      fullWidth
    />
  );
}
```

### `CategorySelect`
```typescript
function CategorySelect(): JSX.Element {
  return (
    <TextField
      select
      {...register('category')}
      label="Category"
      error={!!errors.category}
      helperText={errors.category?.message}
      fullWidth
    >
      {categories.map(category => (
        <MenuItem key={category.id} value={category.id}>
          {category.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
```

## Effects

### Initialize Form
```typescript
useEffect(() => {
  if (product) {
    reset(product);
  }
}, [product, reset]);
```

### Load Data
```typescript
useEffect(() => {
  loadFormData();
}, []);
```

## Example Usage
```typescript
// Create mode
<ProductForm
  onSubmit={handleCreateProduct}
  onCancel={handleClose}
/>

// Edit mode
<ProductForm
  product={selectedProduct}
  onSubmit={handleUpdateProduct}
  onCancel={handleClose}
  isDialog
/>
```

## Error Handling
```typescript
try {
  await onSubmit(data);
  enqueueSnackbar('Product saved successfully', { variant: 'success' });
  onCancel();
} catch (error) {
  enqueueSnackbar(error.message || 'Failed to save product', { variant: 'error' });
}
```

## Form Layout
```typescript
<Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <NameField />
    </Grid>
    <Grid item xs={12} sm={6}>
      <SKUField />
    </Grid>
    {/* Other fields */}
  </Grid>
</Box>
```

## Related Components
- `TextField`
- `MenuItem`
- `Grid`
- `LoadingButton`
- `Dialog` (when used in dialog mode)