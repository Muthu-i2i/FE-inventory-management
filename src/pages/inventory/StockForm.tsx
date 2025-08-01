import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { mockProductService } from '../../mocks/mockProductService';
import { Product, Warehouse } from '../../types/product.types';
import { CreateStockData } from '../../types/inventory.types';

interface StockFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStockData) => Promise<void>;
}

const schema = yup.object().shape({
  product: yup.number().required('Product is required'),
  warehouse: yup.number().required('Warehouse is required'),
  location: yup.number().required('Location is required'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number'),
});

const StockForm: React.FC<StockFormProps> = ({ open, onClose, onSubmit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateStockData>({
    resolver: yupResolver(schema),
    defaultValues: {
      product: 0,
      warehouse: 0,
      location: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsRes, warehousesRes] = await Promise.all([
          mockProductService.getProducts(),
          mockProductService.getWarehouses(),
        ]);
        setProducts(productsRes.results);
        setWarehouses(warehousesRes);
      } catch (error) {
        console.error('Failed to load form data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      loadData();
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateStockData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      // Error handling is done by parent component
      throw error;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Create Stock Entry</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Product"
                    fullWidth
                    error={!!errors.product}
                    helperText={errors.product?.message}
                    disabled={loading || isSubmitting}
                  >
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="warehouse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Warehouse"
                    fullWidth
                    error={!!errors.warehouse}
                    helperText={errors.warehouse?.message}
                    disabled={loading || isSubmitting}
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    error={!!errors.location}
                    helperText={errors.location?.message}
                    disabled={loading || isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Initial Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Stock Entry'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockForm;