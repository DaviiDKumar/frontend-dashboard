import axios from "axios";

const API = axios.create({
  // Use VITE_API_URL or fallback to localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ ADDING THE INTERCEPTOR: This is the magic for Mobile/Safari
API.interceptors.request.use(
  (config) => {
    // 1. Grab the token from localStorage
    const token = localStorage.getItem("token");

    // 2. If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle 401 (unauthorized) errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If the token is invalid or expired, clear storage and send to login
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;