import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { mockProductService } from '../../mocks/mockProductService';
import { Product, ProductFormData, Category, Supplier, Warehouse } from '../../types/product.types';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product;
  mode: 'create' | 'edit';
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  sku: yup.string().required('SKU is required'),
  barcode: yup.string().required('Barcode is required'),
  category_id: yup.string().required('Category is required'),
  supplier_id: yup.string().required('Supplier is required'),
  warehouse_id: yup.string().required('Warehouse is required'),
  unit_price: yup
    .number()
    .typeError('Unit price must be a number')
    .positive('Unit price must be positive')
    .required('Unit price is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
});

const ProductForm: React.FC<ProductFormProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  mode,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          category_id: product.category.id,
          supplier_id: product.supplier.id,
          warehouse_id: product.warehouse.id,
          unit_price: product.unit_price,
          price: product.price,
        }
      : undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, suppliersData, warehousesData] = await Promise.all([
          mockProductService.getCategories(),
          mockProductService.getSuppliers(),
          mockProductService.getWarehouses(),
        ]);
        setCategories(categoriesData);
        setSuppliers(suppliersData);
        setWarehouses(warehousesData);
      } catch (error) {
        enqueueSnackbar('Failed to load form data', { variant: 'error' });
      }
    };
    loadData();
  }, [enqueueSnackbar]);

  const handleFormSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
      enqueueSnackbar(
        `Product ${mode === 'create' ? 'created' : 'updated'} successfully`,
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'An error occurred', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {mode === 'create' ? 'Create Product' : 'Edit Product'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                {...register('sku')}
                error={!!errors.sku}
                helperText={errors.sku?.message}
                disabled={loading || mode === 'edit'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Barcode"
                {...register('barcode')}
                error={!!errors.barcode}
                helperText={errors.barcode?.message}
                disabled={loading || mode === 'edit'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Category"
                {...register('category_id')}
                error={!!errors.category_id}
                helperText={errors.category_id?.message}
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Supplier"
                {...register('supplier_id')}
                error={!!errors.supplier_id}
                helperText={errors.supplier_id?.message}
                disabled={loading}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Warehouse"
                {...register('warehouse_id')}
                error={!!errors.warehouse_id}
                helperText={errors.warehouse_id?.message}
                disabled={loading}
              >
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                {...register('unit_price')}
                error={!!errors.unit_price}
                helperText={errors.unit_price?.message}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
                disabled={loading}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
              ? 'Create'
              : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;