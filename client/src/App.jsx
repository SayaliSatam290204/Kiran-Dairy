import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";

// Auth Pages
import { Login } from "./pages/auth/Login.jsx";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { CreateDispatch } from "./pages/admin/CreateDispatch.jsx";
import { DispatchHistory } from "./pages/admin/DispatchHistory.jsx";
import { AdminLogs } from "./pages/admin/AdminLogs.jsx";
import { Reports } from "./pages/admin/Reports.jsx";

// Shop Pages
import { ShopDashboard } from "./pages/shop/ShopDashboard.jsx";
import { Inventory } from "./pages/shop/Inventory.jsx";
import { POS } from "./pages/shop/POS.jsx";
import { SalesHistory } from "./pages/shop/SalesHistory.jsx";
import { Returns } from "./pages/shop/Returns.jsx";

// Components / Layouts
import { ProtectedRoute } from "./components/common/ProtectedRoute.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ShopLayout } from "./layouts/ShopLayout.jsx";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* 🔥 Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "14px",
            },
          }}
        />

        <Routes>
          {/* Root -> Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dispatch"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <CreateDispatch />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dispatch-history"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <DispatchHistory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminLogs />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Reports />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Shop */}
          <Route
            path="/shop/dashboard"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <ShopDashboard />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/inventory"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <Inventory />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/pos"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <POS />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/sales"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <SalesHistory />
                </ShopLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/returns"
            element={
              <ProtectedRoute allowedRoles={["shop"]}>
                <ShopLayout>
                  <Returns />
                </ShopLayout>
              </ProtectedRoute>
            }
          />

          <Route
          path="/unauthorized"
          element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white border rounded-xl p-8 text-center max-w-md w-full">
              <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
              <p className="text-gray-600 mb-4">You don’t have access to this page.</p>
              <button
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Go Back
                </button>
                </div>
                </div>
              }
              />
          
          {/* 404 */}
          <Route
            path="*"
            element={<div className="p-6 text-center">404 - Page Not Found</div>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;