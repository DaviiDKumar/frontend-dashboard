import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://your-backend.onrender.com/api",
});

// ✅ Attach token to every request header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;