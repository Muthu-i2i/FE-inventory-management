import React, { useState, useEffect } from 'react';
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { 
  PurchaseOrder, 
  CreatePurchaseOrderData,
  PurchaseOrderFormData
} from '../../types/purchase-order.types';
import { purchaseOrderService } from '../../api/purchase-order.api';
import { supplierService } from '../../api/supplier.api';
import { productService } from '../../api/product.api';

interface PurchaseOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  order?: PurchaseOrder | null;
}

const schema = yup.object().shape({
  supplier: yup.number().required('Supplier is required'),
  items: yup.array().of(
    yup.object().shape({
      product: yup.number().required('Product is required'),
      quantity: yup
        .number()
        .required('Quantity is required')
        .positive('Quantity must be positive'),
      unit_price: yup
        .number()
        .required('Unit price is required')
        .positive('Unit price must be positive'),
    })
  ).min(1, 'At least one item is required'),
  notes: yup.string().transform((value) => value || null).nullable(),
  expectedDeliveryDate: yup.string().transform((value) => value || null).nullable(),
});

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  open,
  onClose,
  onSubmit,
  order,
}) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: order ? {
      supplier: order.supplier,
      items: order.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      notes: order.notes,
      expectedDeliveryDate: order.expectedDeliveryDate,
    } : {
      items: [{ product: 0, quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [suppliersRes, productsRes] = await Promise.all([
                supplierService.getSuppliers(),
      productService.getProducts({}),
        ]);
        setSuppliers(suppliersRes.results);
        setProducts(productsRes.results);
      } catch (error) {
        enqueueSnackbar('Failed to load form data', { variant: 'error' });
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

  const onFormSubmit = async (data: PurchaseOrderFormData) => {
    // Convert form data to API format
    const apiData: CreatePurchaseOrderData = {
      supplier: data.supplier,
      items: data.items,
      notes: data.notes || '',
      expectedDeliveryDate: data.expectedDeliveryDate || new Date().toISOString(),
    };
    try {
      if (order) {
        await purchaseOrderService.updatePurchaseOrder(order.id, apiData);
        enqueueSnackbar('Purchase order updated successfully', { variant: 'success' });
      } else {
        await purchaseOrderService.createPurchaseOrder(apiData);
        enqueueSnackbar('Purchase order created successfully', { variant: 'success' });
      }
      onSubmit();
      handleClose();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to save purchase order',
        { variant: 'error' }
      );
    }
  };

  const calculateTotal = () => {
    const items = watch('items');
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unit_price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  if (loading) {
    return (
      <Dialog open={open} maxWidth="md" fullWidth>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 1 },
      }}
    >
      <DialogTitle>
        {order ? 'Edit Purchase Order' : 'Create Purchase Order'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onFormSubmit as any)}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Supplier"
                {...register('supplier')}
                error={!!errors.supplier}
                helperText={errors.supplier?.message}
                disabled={isSubmitting}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expected Delivery Date"
                value={watch('expectedDeliveryDate') ? new Date(watch('expectedDeliveryDate') || '') : null}
                onChange={(date) => setValue('expectedDeliveryDate', date?.toISOString())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.expectedDeliveryDate,
                    helperText: errors.expectedDeliveryDate?.message,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Order Items</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => append({ product: 0, quantity: 1, unit_price: 0 })}
                  >
                    Add Item
                  </Button>
                </Box>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell width={50} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => {
                      const quantity = watch(`items.${index}.quantity`) || 0;
                      const price = watch(`items.${index}.unit_price`) || 0;
                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              {...register(`items.${index}.product`)}
                              error={!!errors.items?.[index]?.product}
                            >
                              {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                  {product.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              {...register(`items.${index}.quantity`)}
                              error={!!errors.items?.[index]?.quantity}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              size="small"
                              {...register(`items.${index}.unit_price`)}
                              error={!!errors.items?.[index]?.unit_price}
                            />
                          </TableCell>
                          <TableCell>
                            ${(quantity * price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <Typography variant="subtitle1">Total:</Typography>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1">
                          ${calculateTotal().toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                {...register('notes')}
                error={!!errors.notes}
                helperText={errors.notes?.message}
              />
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
            {order ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default PurchaseOrderForm;