# Dashboard Component Documentation

## Component Overview
`Dashboard` is the main analytics component displaying various metrics and charts.

## Internal Functions

### `useDashboardData` (Custom Hook)
```typescript
function useDashboardData(timeRange: TimeRange) {
  return {
    analytics: StockAnalytics;
    movements: StockMovementTrend[];
    categories: CategoryDistribution[];
    warehouses: WarehouseDistribution[];
    topProducts: TopProduct[];
    alerts: StockAlert[];
    orders: OrderSummary;
    loading: boolean;
    error: string | null;
  }
}
```

### `handleTimeRangeChange`
```typescript
function handleTimeRangeChange(
  newRange: TimeRange
): void
```
Updates the time range for analytics data.

### `handleExport`
```typescript
async function handleExport(
  format: 'csv' | 'excel' | 'pdf'
): Promise<void>
```
Exports dashboard data in selected format.

## Chart Components

### `StockMovementChart`
```typescript
function StockMovementChart({
  data: StockMovementTrend[]
}): JSX.Element
```
Line chart showing inbound/outbound trends.

### `CategoryDistributionChart`
```typescript
function CategoryDistributionChart({
  data: CategoryDistribution[]
}): JSX.Element
```
Pie chart showing stock by category.

### `TopProductsTable`
```typescript
function TopProductsTable({
  products: TopProduct[]
}): JSX.Element
```
Table displaying top-performing products.

## State Management

### Local State
```typescript
const [timeRange, setTimeRange] = useState<TimeRange>('week');
const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);
const [exporting, setExporting] = useState(false);
```

### Data Loading
```typescript
const {
  analytics,
  movements,
  categories,
  warehouses,
  topProducts,
  alerts,
  orders,
  loading,
  error
} = useDashboardData(timeRange);
```

## Effects

### Load Initial Data
```typescript
useEffect(() => {
  loadDashboardData();
}, [timeRange]);
```

### Custom Date Range
```typescript
useEffect(() => {
  if (timeRange === 'custom' && startDate && endDate) {
    loadCustomRangeData(startDate, endDate);
  }
}, [timeRange, startDate, endDate]);
```

## Error Handling
```typescript
if (error) {
  return (
    <Alert severity="error">
      Failed to load dashboard data: {error}
    </Alert>
  );
}
```

## Loading State
```typescript
if (loading) {
  return (
    <Box display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  );
}
```

## Example Usage
```typescript
// In App.tsx or router
<Route path="/dashboard" element={<Dashboard />} />

// With custom time range
<Dashboard defaultTimeRange="month" />
```

## Component Layout
```typescript
<PageContainer title="Dashboard">
  {/* Time Range Controls */}
  <TimeRangeControls
    value={timeRange}
    onChange={handleTimeRangeChange}
    onDateChange={handleDateChange}
  />

  {/* Summary Cards */}
  <Grid container spacing={3}>
    <SummaryCard
      title="Total Products"
      value={analytics.totalProducts}
      icon={<InventoryIcon />}
    />
    {/* More summary cards */}
  </Grid>

  {/* Charts */}
  <Grid container spacing={3}>
    <Grid item xs={12} md={8}>
      <StockMovementChart data={movements} />
    </Grid>
    <Grid item xs={12} md={4}>
      <CategoryDistributionChart data={categories} />
    </Grid>
  </Grid>

  {/* Tables */}
  <Grid container spacing={3}>
    <Grid item xs={12} md={8}>
      <TopProductsTable products={topProducts} />
    </Grid>
    <Grid item xs={12} md={4}>
      <StockAlerts alerts={alerts} />
    </Grid>
  </Grid>
</PageContainer>
```

## Related Components
- `SummaryCard`
- `TimeRangeControls`
- `StockMovementChart`
- `CategoryDistributionChart`
- `TopProductsTable`
- `StockAlerts`