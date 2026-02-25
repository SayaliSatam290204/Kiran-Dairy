import axiosInstance from './axiosInstance.js';

export const shopApi = {
  getDashboard: () => axiosInstance.get('/shop/dashboard'),
  getInventory: () => axiosInstance.get('/shop/inventory'),
  getReceivedStock: () => axiosInstance.get('/shop/received-stock')
};
