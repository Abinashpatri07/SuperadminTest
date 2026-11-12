import axios from "axios";
import { API_BASE_URL } from "./config.js";
import { clearAllAuthSessions } from "../utils/sessionManager.js";

// Determine base URL depending on env (runtime config → build-time env → localhost fallback)
const BASE_URL = API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("vendorToken") ||
      localStorage.getItem("candidateToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If request payload is FormData, remove default application/json so browser sets multipart/form-data boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized for expired sessions
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      const isAuthRequest = url.includes("/auth/login") || url.includes("/unified-login") || url.includes("/verify-otp");
      const isLoginPage = window.location.pathname === "/" || window.location.pathname === "/portal-login" || window.location.pathname.endsWith("/login");

      // Don't auto-redirect/reload during login attempt, let the login form show the error message!
      if (!isAuthRequest && !isLoginPage) {
        clearAllAuthSessions();
        window.location.href = "/portal-login?logout=true";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
