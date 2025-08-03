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
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import PageContainer from '../../components/common/PageContainer';
import { supplierService } from '../../api/supplier.api';
import { Supplier, SupplierFilters } from '../../types/supplier.types';
import SupplierForm from './SupplierForm';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

const SupplierList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getSuppliers(filters);
      setSuppliers(response.results);
    } catch (error) {
      enqueueSnackbar('Failed to load suppliers', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [filters]);

  const handleCreate = () => {
    setSelectedSupplier(null);
    setFormOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormOpen(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    await loadSuppliers();
    setFormOpen(false);
    setSelectedSupplier(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier) return;

    try {
      await supplierService.deleteSupplier(selectedSupplier.id);
      enqueueSnackbar('Supplier deleted successfully', { variant: 'success' });
      loadSuppliers();
    } catch (error) {
      enqueueSnackbar('Failed to delete supplier', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  return (
    <PageContainer
      title="Suppliers"
      breadcrumbs={[{ label: 'Suppliers' }]}
      action={
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add Supplier
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSuppliers}
          >
            Refresh
          </Button>
        </Box>
      }
    >
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search suppliers..."
            size="small"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <SearchIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            size="small"
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Contact Person</TableCell>}
                <TableCell>Email</TableCell>
                {!isMobile && <TableCell>Phone</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  {!isMobile && <TableCell>{supplier.contactPerson}</TableCell>}
                  <TableCell>{supplier.email}</TableCell>
                  {!isMobile && <TableCell>{supplier.phone}</TableCell>}
                  <TableCell>
                    <Chip
                      label={supplier.status}
                      color={supplier.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(supplier)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(supplier)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SupplierForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        supplier={selectedSupplier}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier"
        content="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </PageContainer>
  );
};

export default SupplierList;