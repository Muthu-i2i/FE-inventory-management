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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { StockItem, MovementType, StockMovementFormData } from '../../types/inventory.types';

interface StockMovementDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockMovementFormData) => Promise<void>;
  stockItem: StockItem;
  type: MovementType;
}

const schema = yup.object().shape({
  quantity: yup
    .number()
    .typeError('Quantity must be a number')
    .positive('Quantity must be positive')
    .required('Quantity is required'),
  reason: yup.string().required('Reason is required'),
  reference: yup.string(),
});

const StockMovementDialog: React.FC<StockMovementDialogProps> = ({
  open,
  onClose,
  onSubmit,
  stockItem,
  type,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StockMovementFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type,
      quantity: 0,
      reason: '',
      reference: '',
    },
  });

  const handleFormSubmit = async (data: StockMovementFormData) => {
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
          <Typography variant="h6">
            {type === MovementType.INBOUND ? 'Stock In' : 'Stock Out'}
          </Typography>
          <IconButton onClick={onClose} size="small">
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
                label="Quantity"
                type="number"
                {...register('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                disabled={isSubmitting}
              />
            </Grid>

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
                {type === MovementType.INBOUND ? (
                  <>
                    <MenuItem value="purchase">Purchase Order</MenuItem>
                    <MenuItem value="return">Customer Return</MenuItem>
                    <MenuItem value="transfer">Stock Transfer</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="sale">Sales Order</MenuItem>
                    <MenuItem value="damage">Damaged Goods</MenuItem>
                    <MenuItem value="transfer">Stock Transfer</MenuItem>
                  </>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reference (Optional)"
                placeholder="Order number, transfer reference, etc."
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockMovementDialog;