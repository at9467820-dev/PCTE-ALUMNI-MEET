import axios from "axios";

const isProduction = typeof window !== "undefined" && !window.location.hostname.includes("localhost");
const API_URL = import.meta.env.VITE_API_URL || (isProduction ? "https://pcte-alumni-meet-1.onrender.com" : "http://localhost:3000/");

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.log("Unauthorized! Redirecting to login...");
      } else if (status === 500) {
        console.log("Server error! Try again later.");
      } else if (status === 403) {
        console.log("Forbidden! You don't have permission.");
      }
    } else {
      console.log("Network error or server not responding.");
    }
    return Promise.reject(error);
  }
);

  export default axiosInstance;