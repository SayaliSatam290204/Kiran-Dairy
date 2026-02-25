import axiosInstance from './axiosInstance.js';

export const returnApi = {
  create: (data) => axiosInstance.post('/return', data),
  getAll: () => axiosInstance.get('/return'),
  getById: (id) => axiosInstance.get(`/return/${id}`),
  update: (id, data) => axiosInstance.put(`/return/${id}`, data)
};
