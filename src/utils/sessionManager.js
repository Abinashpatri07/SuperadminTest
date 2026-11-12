// Utility for unified session management and cross-portal session conflict prevention

export const LOGIN_PATHS = {
  "super-admin": "/portal-login",
  "admin":       "/portal-login",
  "hr":          "/portal-login",
  "vendor":      "/portal-login",
  "candidate":   "/portal-login",
};

export const normalizeRole = (val) => {
  if (!val) return "";
  const r = String(val).toLowerCase().trim();
  if (r.includes("super")) return "super-admin";
  if (r.includes("admin") || r.includes("client")) return "admin";
  if (r.startsWith("hr")) return "hr";
  if (r.includes("vendor")) return "vendor";
  if (r.includes("candidate")) return "candidate";
  return r;
};

export const clearAllAuthSessions = () => {
  const keys = [
    "accessToken",
    "refreshToken",
    "candidateToken",
    "vendorToken",
    "vendorRefreshToken",
    "vendorRole",
    "vendorUser",
    "role",
    "user",
    "token",
    "adminToken",
    "clientToken",
    "hrToken",
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  sessionStorage.clear();
};

export const getTokenForRole = (role) => {
  const norm = normalizeRole(role);
  if (norm === "candidate") return localStorage.getItem("candidateToken") || localStorage.getItem("accessToken");
  if (norm === "vendor") return localStorage.getItem("vendorToken") || localStorage.getItem("accessToken");
  return localStorage.getItem("accessToken");
};