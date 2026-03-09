import axios from "axios";
import axiosInstance from "./axiosInstance.js";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
});

export const authApi = {
  login: (payload) => API.post("/auth/login", payload),
  registerAdmin: (payload) => API.post("/auth/admin/register", payload),
  adminExists: () => API.get("/auth/admin/exists"),
  getProfile: () => axiosInstance.get("/auth/profile"),
  updateProfile: (payload) => axiosInstance.put("/auth/profile", payload),
  changePassword: (payload) => axiosInstance.post("/auth/change-password", payload),
};