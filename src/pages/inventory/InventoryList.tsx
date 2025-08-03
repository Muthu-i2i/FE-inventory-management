import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  SwapHoriz as TransferIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';
import PageContainer from '../../components/common/PageContainer';
import { inventoryService } from '../../api/inventory.api';
import { StockResponse, StockMovement, StockAdjustment, MovementType } from '../../types/inventory.types';
import StockHistory from './StockHistory';
import StockTransfer from './StockTransfer';
import StockForm from './StockForm';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';

const InventoryList: React.FC = () => {
  const [stocks, setStocks] = useState<StockResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [stockFormOpen, setStockFormOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockResponse | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await inventoryService.getStock({});
      setStocks(response.results);
    } catch (error) {
      enqueueSnackbar('Failed to load stock data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHistoryClick = async (stock: StockResponse) => {
    setSelectedStock(stock);
    try {
      // In a real app, these would be API calls
      const movements = await inventoryService.getStockMovements(stock.id);
      const adjustments = await inventoryService.getStockAdjustments(stock.id);
      setStockMovements(movements);
      setStockAdjustments(adjustments);
      setHistoryDialogOpen(true);
    } catch (error) {
      enqueueSnackbar('Failed to load stock history', { variant: 'error' });
    }
  };

  const handleTransferClick = (stock: StockResponse) => {
    setSelectedStock(stock);
    setTransferDialogOpen(true);
  };

  const handleDeleteClick = (stock: StockResponse) => {
    setSelectedStock(stock);
    setDeleteConfirmOpen(true);
  };

  const handleTransferSubmit = async (data: any) => {
    if (!selectedStock) return;

    try {
      await inventoryService.recordStockMovement({
        stock: selectedStock.id,
        movement_type: MovementType.OUTBOUND,
        quantity: data.quantity,
        reason: `Transfer to Warehouse ${data.targetWarehouse}`,
      });

      await inventoryService.recordStockMovement({
        stock: selectedStock.id,
        movement_type: MovementType.INBOUND,
        quantity: data.quantity,
        reason: `Transfer from Warehouse ${selectedStock.warehouse}`,
      });

      enqueueSnackbar('Stock transferred successfully', { variant: 'success' });
      loadData();
      setTransferDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : 'Failed to transfer stock',
        { variant: 'error' }
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedStock) return;

    try {
      await inventoryService.deleteStock(selectedStock.id);
      enqueueSnackbar('Stock deleted successfully', { variant: 'success' });
      setDeleteConfirmOpen(false);
      loadData();
    } catch (error) {
      enqueueSnackbar('Failed to delete stock', { variant: 'error' });
    }
  };

  const filteredStocks = stocks.filter((stock) =>
    Object.values(stock).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <PageContainer title="Inventory Management">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Inventory Management"
      breadcrumbs={[{ label: 'Inventory' }]}
      action={
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setStockFormOpen(true)}
          >
            Add Stock
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
          >
            Refresh
          </Button>
        </Box>
      }
    >
      <Card>
        <CardHeader 
          title="Stock Items"
          sx={{ 
            pb: 0,
            '& .MuiCardHeader-title': {
              fontSize: '1.1rem',
              fontWeight: 600
            }
          }}
        />
        <CardContent>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search stock items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />
          </Box>

          {/* Stock Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.product.name}</TableCell>
                    <TableCell>{stock.warehouse}</TableCell>
                    <TableCell>{stock.location}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={stock.quantity}
                        color={stock.quantity === 0 ? 'error' : stock.quantity < 10 ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleTransferClick(stock)}
                        title="Transfer Stock"
                      >
                        <TransferIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleHistoryClick(stock)}
                        title="View History"
                      >
                        <HistoryIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(stock)}
                        title="Delete Stock"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {selectedStock && (
        <>
          <StockTransfer
            open={transferDialogOpen}
            onClose={() => setTransferDialogOpen(false)}
            stock={selectedStock}
            onSubmit={handleTransferSubmit}
          />

          <StockHistory
            open={historyDialogOpen}
            onClose={() => setHistoryDialogOpen(false)}
            stockId={selectedStock.id}
            movements={stockMovements}
            adjustments={stockAdjustments}
          />

          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleDelete}
            title="Delete Stock"
            content="Are you sure you want to delete this stock entry? This action cannot be undone."
          />
        </>
      )}

      <StockForm
        open={stockFormOpen}
        onClose={() => setStockFormOpen(false)}
        onSubmit={async () => {
          setStockFormOpen(false);
          loadData();
        }}
      />
    </PageContainer>
  );
};

export default InventoryList;