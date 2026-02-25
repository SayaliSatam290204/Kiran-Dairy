import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { ShopLayout } from './layouts/ShopLayout.jsx';

// Auth Pages
import { AdminLogin } from './pages/auth/AdminLogin.jsx';
import { ShopLogin } from './pages/auth/ShopLogin.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { CreateDispatch } from './pages/admin/CreateDispatch.jsx';
import { DispatchHistory } from './pages/admin/DispatchHistory.jsx';
import { AdminLogs } from './pages/admin/AdminLogs.jsx';
import { Reports } from './pages/admin/Reports.jsx';

// Shop Pages
import { ShopDashboard } from './pages/shop/ShopDashboard.jsx';
import { Inventory } from './pages/shop/Inventory.jsx';
import { POS } from './pages/shop/POS.jsx';
import { SalesHistory } from './pages/shop/SalesHistory.jsx';
import { Returns } from './pages/shop/Returns.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/shop-login" element={<ShopLogin />} />
      <Route path="/login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dispatch"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <CreateDispatch />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dispatch-history"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <DispatchHistory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <AdminLogs />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Shop Routes */}
      <Route
        path="/shop/dashboard"
        element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopLayout>
              <ShopDashboard />
            </ShopLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/inventory"
        element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopLayout>
              <Inventory />
            </ShopLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/pos"
        element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopLayout>
              <POS />
            </ShopLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/sales"
        element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopLayout>
              <SalesHistory />
            </ShopLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shop/returns"
        element={
          <ProtectedRoute allowedRoles={['shop']}>
            <ShopLayout>
              <Returns />
            </ShopLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/admin-login" />} />
      <Route path="*" element={<div className="p-6 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
};
