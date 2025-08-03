import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StockMovementData, StockMovementFormData, MovementType } from '../../types/inventory.types';

interface StockMovementFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockMovementData) => Promise<void>;
  stockId: number;
  type: 'IN' | 'OUT';
  currentQuantity: number;
}

const schema = yup.object().shape({
  quantity: yup
    .number()
    .required('Quantity is required')
    .positive('Quantity must be positive')
    .integer('Quantity must be a whole number'),
  reason: yup.string().required('Reason is required'),
});

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  open,
  onClose,
  onSubmit,
  stockId,
  type,
  currentQuantity,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StockMovementFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: 0,
      reason: '',
      reference: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: StockMovementFormData) => {
    const submitData: StockMovementData = {
      stock: stockId,
      movement_type: type === 'IN' ? MovementType.INBOUND : MovementType.OUTBOUND,
      quantity: data.quantity,
      reason: data.reason,
      reference: data.reference,
    };
    try {
      await onSubmit(submitData);
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
          <Typography variant="h6">
            {type === 'IN' ? 'Stock In' : 'Stock Out'} Movement
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Stock
                </Typography>
                <Typography variant="h6">{currentQuantity}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    disabled={isSubmitting}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Reason"
                    fullWidth
                    error={!!errors.reason}
                    helperText={errors.reason?.message}
                    disabled={isSubmitting}
                  >
                    {type === 'IN' ? (
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
            color={type === 'IN' ? 'primary' : 'warning'}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Confirm Movement'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockMovementForm;