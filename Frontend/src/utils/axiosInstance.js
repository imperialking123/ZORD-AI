import axios from "axios";


const BACKEND_API_BASE = `${import.meta.env.VITE_BACKEND_BASE_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BACKEND_API_BASE,
  withCredentials: true,
});
  
export default axiosInstance;
