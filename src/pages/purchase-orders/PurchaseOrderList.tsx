import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Dialog,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  LocalShipping as ReceiveIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enqueueSnackbar } from 'notistack';
import PageContainer from '../../components/common/PageContainer';
import { purchaseOrderService } from '../../api/purchase-order.api';
import { PurchaseOrder, PurchaseOrderFilters, PurchaseOrderStatus } from '../../types/purchase-order.types';
import PurchaseOrderForm from './PurchaseOrderForm';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

const statusColors: Record<PurchaseOrderStatus, 'default' | 'primary' | 'success' | 'error'> = {
  draft: 'default',
  open: 'primary',
  received: 'success',
  cancelled: 'error',
};

const PurchaseOrderList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<PurchaseOrderFilters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await purchaseOrderService.getPurchaseOrders(filters);
      setOrders(response.results);
    } catch (error) {
      enqueueSnackbar('Failed to load purchase orders', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const handleCreate = () => {
    setSelectedOrder(null);
    setFormOpen(true);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleDelete = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleReceive = async (order: PurchaseOrder) => {
    try {
      await purchaseOrderService.receivePurchaseOrder(order.id);
      enqueueSnackbar('Purchase order received successfully', { variant: 'success' });
      loadOrders();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to receive order',
        { variant: 'error' }
      );
    }
  };

  const handleFormSubmit = async () => {
    await loadOrders();
    setFormOpen(false);
    setSelectedOrder(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedOrder(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    try {
      await purchaseOrderService.deletePurchaseOrder(selectedOrder.id);
      enqueueSnackbar('Purchase order deleted successfully', { variant: 'success' });
      loadOrders();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to delete order',
        { variant: 'error' }
      );
    } finally {
      setDeleteDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  return (
    <PageContainer
      title="Purchase Orders"
      breadcrumbs={[{ label: 'Purchase Orders' }]}
      action={
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Order
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadOrders}
          >
            Refresh
          </Button>
        </Box>
      }
    >
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search orders..."
            size="small"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
          <TextField
            select
            size="small"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as PurchaseOrderStatus })}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="received">Received</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <DatePicker
            label="From Date"
            value={filters.dateFrom ? new Date(filters.dateFrom) : null}
            onChange={(date) =>
              setFilters({ ...filters, dateFrom: date?.toISOString() })
            }
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="To Date"
            value={filters.dateTo ? new Date(filters.dateTo) : null}
            onChange={(date) =>
              setFilters({ ...filters, dateTo: date?.toISOString() })
            }
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Supplier</TableCell>
                {!isMobile && <TableCell>Date</TableCell>}
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(order)}
                      color="primary"
                      disabled={order.status === 'received'}
                    >
                      <EditIcon />
                    </IconButton>
                    {order.status === 'open' && (
                      <IconButton
                        size="small"
                        onClick={() => handleReceive(order)}
                        color="success"
                      >
                        <ReceiveIcon />
                      </IconButton>
                    )}
                    {order.status === 'draft' && (
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(order)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PurchaseOrderForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        order={selectedOrder}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Purchase Order"
        content="Are you sure you want to delete this purchase order? This action cannot be undone."
      />
    </PageContainer>
  );
};

export default PurchaseOrderList;