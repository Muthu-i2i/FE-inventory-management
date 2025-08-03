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
  Box,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { Supplier, CreateSupplierData } from '../../types/supplier.types';
import { supplierService } from '../../api/supplier.api';

interface SupplierFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  supplier?: Supplier | null;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().nullable(),
  address: yup.string().nullable(),
  contactPerson: yup.string().nullable(),
  status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
});

const SupplierForm: React.FC<SupplierFormProps> = ({
  open,
  onClose,
  onSubmit,
  supplier,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplierData>({
    resolver: yupResolver(schema),
    defaultValues: supplier || {
      status: 'active',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CreateSupplierData) => {
    try {
      if (supplier) {
        await supplierService.updateSupplier(supplier.id, data);
        enqueueSnackbar('Supplier updated successfully', { variant: 'success' });
      } else {
        await supplierService.createSupplier(data);
        enqueueSnackbar('Supplier created successfully', { variant: 'success' });
      }
      onSubmit();
      handleClose();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to save supplier',
        { variant: 'error' }
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1 },
      }}
    >
      <DialogTitle>
        {supplier ? 'Edit Supplier' : 'Create New Supplier'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                {...register('contactPerson')}
                error={!!errors.contactPerson}
                helperText={errors.contactPerson?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                {...register('status')}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {supplier ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SupplierForm;