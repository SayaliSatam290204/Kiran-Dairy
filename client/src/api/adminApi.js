import axiosInstance from './axiosInstance.js';

export const adminApi = {
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  getShops: () => axiosInstance.get('/admin/shops'),
  getProducts: () => axiosInstance.get('/admin/products'),
  createDispatch: (data) => axiosInstance.post('/dispatch', data),
  getDispatches: () => axiosInstance.get('/dispatch')
};
