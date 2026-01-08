import axios from "axios";

const API = axios.create({
  // Use the env variable, or fallback to the standard LOCAL port
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 1. Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Safety check for literal "undefined" strings
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Catch 401 (Expired/Invalid Token)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server says 401, the token is bad. Clear it and go to login.
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default API;