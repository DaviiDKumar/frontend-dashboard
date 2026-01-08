// src/api/axios.js
import axios from "axios";

const API = axios.create({
  // Vite uses import.meta.env instead of process.env
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // ✅ allows cross-site cookies
});

export default API;