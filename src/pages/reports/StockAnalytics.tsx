import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { mockInventoryService } from '../../mocks/mockInventoryService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface StockAnalytics {
  stockValue: number;
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockTurnover: number;
}

interface StockMovementTrend {
  date: string;
  inbound: number;
  outbound: number;
}

interface StockDistribution {
  warehouse: string;
  quantity: number;
}

const StockAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [analytics, setAnalytics] = useState<StockAnalytics>({
    stockValue: 0,
    totalItems: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    stockTurnover: 0,
  });
  const [movementTrends, setMovementTrends] = useState<StockMovementTrend[]>([]);
  const [distribution, setDistribution] = useState<StockDistribution[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, startDate, endDate]);

  const loadAnalytics = async () => {
    try {
      // In a real app, these would be API calls with proper date ranges
      const stockData = await mockInventoryService.getStock({});
      
      // Mock data for demonstration
      setAnalytics({
        stockValue: 150000,
        totalItems: stockData.count,
        lowStockItems: 5,
        outOfStockItems: 2,
        stockTurnover: 3.5,
      });

      setMovementTrends([
        { date: 'Mon', inbound: 40, outbound: 24 },
        { date: 'Tue', inbound: 30, outbound: 35 },
        { date: 'Wed', inbound: 20, outbound: 15 },
        { date: 'Thu', inbound: 27, outbound: 23 },
        { date: 'Fri', inbound: 45, outbound: 38 },
      ]);

      setDistribution([
        { warehouse: 'Warehouse A', quantity: 300 },
        { warehouse: 'Warehouse B', quantity: 250 },
        { warehouse: 'Warehouse C', quantity: 200 },
        { warehouse: 'Warehouse D', quantity: 150 },
      ]);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  return (
    <Box>
      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                select
                fullWidth
                label="Time Range"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
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
            <Grid item xs={12} sm={3}>
              <Button variant="contained" onClick={loadAnalytics}>
                Update Analytics
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Stock Value
              </Typography>
              <Typography variant="h4">
                ${analytics.stockValue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4">
                {analytics.totalItems.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <Typography variant="h4" color="warning.main">
                {analytics.lowStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" color="error.main">
                {analytics.outOfStockItems}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Stock Turnover
              </Typography>
              <Typography variant="h4">
                {analytics.stockTurnover.toFixed(1)}x
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Stock Movement Trends */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Movement Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={movementTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
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

        {/* Stock Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Distribution by Warehouse
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="quantity"
                      nameKey="warehouse"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {distribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Value Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Value by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: 'Electronics', value: 50000 },
                      { category: 'Furniture', value: 35000 },
                      { category: 'Clothing', value: 25000 },
                      { category: 'Accessories', value: 40000 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockAnalytics;