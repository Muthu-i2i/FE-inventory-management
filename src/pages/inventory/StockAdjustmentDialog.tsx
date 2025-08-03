import React from 'react';
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
  MenuItem,
  Box,
  IconButton,
  Typography,
  Grid,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { StockItem } from '../../types/inventory.types';
import { StockAdjustmentFormData } from '../../types/inventory.types';

interface StockAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockAdjustmentFormData) => Promise<void>;
  stockItem: StockItem;
}

const schema = yup.object().shape({
  new_quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .min(0, 'Quantity cannot be negative')
    .required('New quantity is required'),
  reason: yup.string().required('Reason is required'),
  reference: yup.string().optional(),
});

const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  stockItem,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      new_quantity: stockItem.quantity,
      reason: '',
      reference: '',
    },
  });

  const newQuantity = watch('new_quantity');
  const quantityDifference = newQuantity - stockItem.quantity;

  const handleFormSubmit = async (data: StockAdjustmentFormData): Promise<void> => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      // Error will be handled by the parent component
      throw error;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Adjust Stock Quantity</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit as any)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {stockItem.product.name}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Stock
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {stockItem.quantity}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Quantity"
                type="number"
                {...register('new_quantity')}
                error={!!errors.new_quantity}
                helperText={errors.new_quantity?.message}
                disabled={isSubmitting}
              />
            </Grid>

            {quantityDifference !== 0 && (
              <Grid item xs={12}>
                <Alert
                  severity={quantityDifference > 0 ? 'info' : 'warning'}
                  sx={{ mb: 2 }}
                >
                  This will {quantityDifference > 0 ? 'add' : 'remove'}{' '}
                  <strong>{Math.abs(quantityDifference)}</strong> units{' '}
                  {quantityDifference > 0 ? 'to' : 'from'} the current stock.
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                select
                {...register('reason')}
                error={!!errors.reason}
                helperText={errors.reason?.message}
                disabled={isSubmitting}
              >
                <MenuItem value="inventory_count">Inventory Count</MenuItem>
                <MenuItem value="damaged">Damaged/Defective</MenuItem>
                <MenuItem value="lost">Lost/Missing</MenuItem>
                <MenuItem value="system_correction">System Correction</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference (Optional)"
                placeholder="Inventory count reference, incident number, etc."
                {...register('reference')}
                error={!!errors.reference}
                helperText={errors.reference?.message}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={quantityDifference < 0 ? 'warning' : 'primary'}
            disabled={isSubmitting || quantityDifference === 0}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Adjustment'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockAdjustmentDialog;