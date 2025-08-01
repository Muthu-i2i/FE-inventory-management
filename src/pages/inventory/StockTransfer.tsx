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
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { mockProductService } from '../../mocks/mockProductService';
import { Warehouse } from '../../types/product.types';
import { StockResponse } from '../../types/inventory.types';

interface StockTransferFormData {
  targetWarehouse: number;
  targetLocation: number;
  quantity: number;
  reason: string;
}

interface StockTransferProps {
  open: boolean;
  onClose: () => void;
  stock: StockResponse;
  onSubmit: (data: StockTransferFormData) => Promise<void>;
}

const schema = yup.object().shape({
  targetWarehouse: yup.number().required('Target warehouse is required'),
  targetLocation: yup.number().required('Target location is required'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number'),
  reason: yup.string().required('Reason is required'),
});

const StockTransfer: React.FC<StockTransferProps> = ({
  open,
  onClose,
  stock,
  onSubmit,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StockTransferFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      targetWarehouse: 0,
      targetLocation: 0,
      quantity: 0,
      reason: '',
    },
  });

  const watchQuantity = watch('quantity');

  useEffect(() => {
    const loadWarehouses = async () => {
      setLoading(true);
      try {
        const response = await mockProductService.getWarehouses();
        setWarehouses(response.filter(w => w.id !== stock.warehouse));
      } catch (error) {
        console.error('Failed to load warehouses:', error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      loadWarehouses();
    }
  }, [open, stock.warehouse]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: StockTransferFormData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
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
          <Typography variant="h6">Transfer Stock</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Location
                </Typography>
                <Typography variant="body1">
                  Warehouse {stock.warehouse} - Location {stock.location}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Available Quantity
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {stock.quantity}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="targetWarehouse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Target Warehouse"
                    fullWidth
                    error={!!errors.targetWarehouse}
                    helperText={errors.targetWarehouse?.message}
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
                name="targetLocation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Target Location"
                    fullWidth
                    error={!!errors.targetLocation}
                    helperText={errors.targetLocation?.message}
                    disabled={isSubmitting}
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
                    label="Transfer Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            {watchQuantity > stock.quantity && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Transfer quantity cannot exceed available quantity
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Transfer Reason"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
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
            disabled={isSubmitting || loading || watchQuantity > stock.quantity}
          >
            {isSubmitting ? 'Transferring...' : 'Transfer Stock'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockTransfer;