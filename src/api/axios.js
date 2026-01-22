import axios from "axios";



const API = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

});



API.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {

      config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

  },

  (error) => Promise.reject(error)

);



API.interceptors.response.use(

  (response) => response,

  (error) => {

    // ✅ FIX: Check if the error is NOT from the login endpoint

    const isLoginRequest = error.config?.url?.includes("/auth/login");



    if (error.response && error.response.status === 401 && !isLoginRequest) {

      // Only clear and redirect if we aren't already on the login page

      localStorage.removeItem("token");

      localStorage.removeItem("role");

      window.location.href = "/login";

    }

   

    return Promise.reject(error);

  }

);



export default API; 