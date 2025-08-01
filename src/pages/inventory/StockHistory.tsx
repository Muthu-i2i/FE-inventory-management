import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { StockMovement, StockAdjustment } from '../../types/inventory.types';

interface StockHistoryProps {
  open: boolean;
  onClose: () => void;
  stockId: number;
  movements: StockMovement[];
  adjustments: StockAdjustment[];
}

const StockHistory: React.FC<StockHistoryProps> = ({
  open,
  onClose,
  movements,
  adjustments,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Combine and sort movements and adjustments by date
  const history = [
    ...movements.map(m => ({
      ...m,
      type: 'movement' as const,
      date: new Date(m.date),
    })),
    ...adjustments.map(a => ({
      ...a,
      type: 'adjustment' as const,
      date: new Date(a.date),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getStatusChip = (item: typeof history[0]) => {
    if (item.type === 'movement') {
      return (
        <Chip
          label={item.movement_type}
          color={item.movement_type === 'IN' ? 'success' : 'warning'}
          size="small"
        />
      );
    }
    return (
      <Chip
        label={item.adjustment_type}
        color={item.adjustment_type === 'ADD' ? 'info' : 'error'}
        size="small"
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Stock History</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(item.date).toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </TableCell>
                    <TableCell>{getStatusChip(item)}</TableCell>
                    <TableCell align="right">
                      <Typography
                        color={
                          (item.type === 'movement' && item.movement_type === 'IN') ||
                          (item.type === 'adjustment' && item.adjustment_type === 'ADD')
                            ? 'success.main'
                            : 'error.main'
                        }
                      >
                        {(item.type === 'movement' && item.movement_type === 'IN') ||
                        (item.type === 'adjustment' && item.adjustment_type === 'ADD')
                          ? '+'
                          : '-'}
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>
                      {item.type === 'movement' ? item.reference : `Approved by ID: ${item.approved_by}`}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={history.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StockHistory;