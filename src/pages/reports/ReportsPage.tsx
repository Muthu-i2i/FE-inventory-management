import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { enqueueSnackbar } from 'notistack';
import PageContainer from '../../components/common/PageContainer';
import { mockReportService } from '../../mocks/mockReportService';
import { TimeRange } from '../../types/report.types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<any>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        analytics,
        movements,
        categories,
        warehouses,
        topProducts,
        alerts,
        orders,
      ] = await Promise.all([
        mockReportService.getStockAnalytics(),
        mockReportService.getStockMovements(timeRange),
        mockReportService.getCategoryDistribution(),
        mockReportService.getWarehouseDistribution(),
        mockReportService.getTopProducts(),
        mockReportService.getStockAlerts(),
        mockReportService.getOrderSummary(timeRange),
      ]);

      setData({
        analytics,
        movements,
        categories,
        warehouses,
        topProducts,
        alerts,
        orders,
      });
    } catch (error) {
      enqueueSnackbar('Failed to load report data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setExporting(true);
    try {
      const blob = await mockReportService.exportReport(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      enqueueSnackbar('Report exported successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to export report', { variant: 'error' });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Reports & Analytics">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Reports & Analytics"
      action={
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('excel')}
            disabled={exporting}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
            disabled={exporting}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      }
    >
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              label="Time Range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </TextField>
          </Grid>
          {timeRange === 'custom' && (
            <>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {data.analytics.totalProducts.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stock Value
              </Typography>
              <Typography variant="h4">
                ${data.analytics.stockValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {data.analytics.lowStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {data.analytics.outOfStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Stock Movement Trends */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardHeader title="Stock Movement Trends" />
            <CardContent>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={data.movements}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="inbound"
                      stroke="#8884d8"
                      name="Inbound"
                    />
                    <Line
                      type="monotone"
                      dataKey="outbound"
                      stroke="#82ca9d"
                      name="Outbound"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardHeader title="Category Distribution" />
            <CardContent>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.categories}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label
                    >
                      {data.categories.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Top Products by Value" />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">Turnover Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topProducts.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">
                          ${product.value.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{product.turnoverRate}x</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardHeader 
              title="Stock Alerts"
              action={
                <Chip
                  label={`${data.alerts.length} Alerts`}
                  color="error"
                  size="small"
                />
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Warehouse</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell align="right">Min Required</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.alerts.map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.product}</TableCell>
                        <TableCell>{alert.warehouse}</TableCell>
                        <TableCell align="right">{alert.currentStock}</TableCell>
                        <TableCell align="right">{alert.minRequired}</TableCell>
                        <TableCell>
                          <Chip
                            label={alert.status === 'out' ? 'Out of Stock' : 'Low Stock'}
                            color={alert.status === 'out' ? 'error' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ReportsPage;