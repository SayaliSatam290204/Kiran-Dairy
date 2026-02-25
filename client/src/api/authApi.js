import axiosInstance from './axiosInstance.js';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
  }
};
