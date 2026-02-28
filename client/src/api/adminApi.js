import axiosInstance from './axiosInstance.js';

export const adminApi = {
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  getShops: () => axiosInstance.get('/admin/shops'),
  getAllShops: () => axiosInstance.get('/admin/all-shops'),
  createShop: (data) => axiosInstance.post('/admin/shops', data),
  updateShop: (id, data) => axiosInstance.put(`/admin/shops/${id}`, data),
  deleteShop: (id) => axiosInstance.delete(`/admin/shops/${id}`),
  getProducts: () => axiosInstance.get('/admin/products'),
  getStaffPerformance: () => axiosInstance.get('/admin/staff-performance'),
  
  // Dispatch operations
  createDispatch: (data) => axiosInstance.post('/dispatch', data),
  createBatchDispatch: (data) => axiosInstance.post('/dispatch', { ...data, isBatchDispatch: true }),
  getDispatches: () => axiosInstance.get('/dispatch'),
  getDispatchById: (id) => axiosInstance.get(`/dispatch/${id}`),
  updateDispatch: (id, data) => axiosInstance.put(`/dispatch/${id}`, data),
  updateDispatchStatus: (id, data) => axiosInstance.put(`/dispatch/${id}/status`, data),
  getDispatchAnalytics: (filters = {}) => axiosInstance.get('/dispatch/analytics', { params: filters }),
  
  // Stock Ledger
  getStockLedger: () => axiosInstance.get('/ledger'),
  getLedgerByShop: (shopId) => axiosInstance.get(`/ledger/shop/${shopId}`),
  getLedgerByProduct: (productId) => axiosInstance.get(`/ledger/product/${productId}`),
  
  // Reports
  generateReport: (filters) => axiosInstance.get('/admin/reports', { params: filters }),
  
  // Sales
  getAllSales: () => axiosInstance.get('/sales'),

  // Staff Performance
  getStaffPerformance: () => axiosInstance.get('/admin/staff-performance'),
  getStaffDetailedPerformance: (staffId, year, month) => 
    axiosInstance.get(`/admin/staff-performance/${staffId}`, { params: { year, month } }),
  getShopStaffPerformance: (shopId, period = 'monthly', year, month) =>
    axiosInstance.get(`/admin/shop-staff-performance/${shopId}`, { 
      params: { period, year, month } 
    })
};
