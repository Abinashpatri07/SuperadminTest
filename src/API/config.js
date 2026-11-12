/**
 * Single source of truth for the backend API base URL.
 *
 * Resolution order (first non-empty wins):
 *  1. window.__BGV_CONFIG__.API_URL  -> runtime override served from /config.js (public/).
 *     This is a plain static file, so the deployed API URL can be corrected
 *     without rebuilding or redeploying the bundle.
 *  2. import.meta.env.VITE_API_URL   -> build-time value from .env / .env.<mode>.
 *  3. ""                              -> same-origin fallback.
 */

const runtimeConfig =
  typeof window !== "undefined" && window.__BGV_CONFIG__ ? window.__BGV_CONFIG__ : {};

const resolveApiBaseUrl = () => {
  // If running locally in development, always use local backend to avoid CORS and wrong proxy routing
  if (typeof window !== "undefined" && window.location) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return import.meta.env.VITE_API_URL || "http://localhost:5002";
    }
  }

  let candidate = runtimeConfig.API_URL;
  // Discard any legacy onrender domain if set mistakenly
  if (typeof candidate === "string" && candidate.includes("onrender.com")) {
    candidate = "";
  }
  if (!candidate) {
    candidate = import.meta.env.VITE_API_URL || "";
  }
  if (!candidate) {
    candidate = "https://api.dqnex.online";
  }
  return String(candidate).replace(/\/+$/, "");
};

export const API_BASE_URL = resolveApiBaseUrl();

export default API_BASE_URL;
