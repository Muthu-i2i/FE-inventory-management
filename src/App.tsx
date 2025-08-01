import { ThemeProvider } from '@emotion/react';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryList from './pages/inventory/InventoryList';
import ProductList from './pages/products/ProductList';
import SupplierList from './pages/suppliers/SupplierList';
import PurchaseOrderList from './pages/purchase-orders/PurchaseOrderList';
import { store } from './store/store';
import { theme } from './theme/theme';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
                              <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProductList />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <InventoryList />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SupplierList />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PurchaseOrderList />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;