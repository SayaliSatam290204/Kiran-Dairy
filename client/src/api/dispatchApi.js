import axiosInstance from './axiosInstance.js';

export const dispatchApi = {
  create: (data) => axiosInstance.post('/dispatch', data),
  getAll: () => axiosInstance.get('/dispatch'),
  getById: (id) => axiosInstance.get(`/dispatch/${id}`),
  update: (id, data) => axiosInstance.put(`/dispatch/${id}`, data),
  delete: (id) => axiosInstance.delete(`/dispatch/${id}`)
};
