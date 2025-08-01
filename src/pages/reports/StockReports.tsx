import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface ReportFilters {
  reportType: string;
  warehouse: string;
  category: string;
  startDate: Date | null;
  endDate: Date | null;
}

const StockReports: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: 'inventory',
    warehouse: '',
    category: '',
    startDate: null,
    endDate: null,
  });

  const handleFilterChange = (field: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const generateReport = () => {
    // In a real app, this would call an API to generate the report
    console.log('Generating report with filters:', filters);
  };

  const downloadReport = () => {
    // In a real app, this would trigger a file download
    console.log('Downloading report...');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Box>
      {/* Report Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={filters.reportType}
                onChange={(e) => handleFilterChange('reportType', e.target.value)}
              >
                <MenuItem value="inventory">Current Inventory</MenuItem>
                <MenuItem value="movement">Stock Movements</MenuItem>
                <MenuItem value="valuation">Stock Valuation</MenuItem>
                <MenuItem value="turnover">Stock Turnover</MenuItem>
                <MenuItem value="aging">Stock Aging</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Warehouse"
                value={filters.warehouse}
                onChange={(e) => handleFilterChange('warehouse', e.target.value)}
              >
                <MenuItem value="">All Warehouses</MenuItem>
                <MenuItem value="1">Warehouse A</MenuItem>
                <MenuItem value="2">Warehouse B</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="1">Electronics</MenuItem>
                <MenuItem value="2">Furniture</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={generateReport}
                sx={{ height: '100%' }}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">
              {filters.reportType === 'inventory' && 'Current Inventory Report'}
              {filters.reportType === 'movement' && 'Stock Movement Report'}
              {filters.reportType === 'valuation' && 'Stock Valuation Report'}
              {filters.reportType === 'turnover' && 'Stock Turnover Report'}
              {filters.reportType === 'aging' && 'Stock Aging Report'}
            </Typography>
            <Box>
              <IconButton onClick={downloadReport} title="Download Report">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={printReport} title="Print Report">
                <PrintIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {filters.reportType === 'inventory' && (
                    <>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Warehouse</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </>
                  )}
                  {filters.reportType === 'movement' && (
                    <>
                      <TableCell>Date</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Reference</TableCell>
                    </>
                  )}
                  {filters.reportType === 'valuation' && (
                    <>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Cost</TableCell>
                      <TableCell align="right">Total Value</TableCell>
                    </>
                  )}
                  {/* Add more report type columns as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Generate a report to view data
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockReports;