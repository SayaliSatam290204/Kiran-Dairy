import axiosInstance from './axiosInstance.js';

export const shopApi = {
  getDashboard: () => axiosInstance.get('/shop/dashboard'),
  getInventory: () => axiosInstance.get('/shop/inventory'),
  getReceivedDispatches: () => axiosInstance.get('/shop/received-dispatches'),
  getReceivedStock: () => axiosInstance.get('/shop/received-dispatches'), // Alias
  getSalesHistory: () => axiosInstance.get('/sales/history'),
  addToInventory: (data) => axiosInstance.post('/sales/add-inventory', data),
  getStaffPerformance: (period = 'monthly', year, month, date) =>
    axiosInstance.get('/shop/staff-performance', { 
      params: { period, year, month, date } 
    })
};
