import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  TrendingUp as InboundIcon,
  TrendingDown as OutboundIcon,
  Warning as AlertIcon,
  Inventory as StockIcon,
} from '@mui/icons-material';

interface StockSummary {
  totalStock: number;
  lowStock: number;
  inboundToday: number;
  outboundToday: number;
}

const StockCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            p: 1,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { fontSize: 24, color },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const InventoryDashboard: React.FC<{ summary: StockSummary }> = ({ summary }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StockCard
          title="Total Stock Items"
          value={summary.totalStock}
          icon={<StockIcon />}
          color="#2563eb"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StockCard
          title="Low Stock Alerts"
          value={summary.lowStock}
          icon={<AlertIcon />}
          color="#dc2626"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StockCard
          title="Inbound Today"
          value={summary.inboundToday}
          icon={<InboundIcon />}
          color="#059669"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StockCard
          title="Outbound Today"
          value={summary.outboundToday}
          icon={<OutboundIcon />}
          color="#9333ea"
        />
      </Grid>
    </Grid>
  );
};

export default InventoryDashboard;