const API_BASE =
  import.meta.env.MODE === "production"
    ? "/api" 
    : "http://localhost:5000/api";

export const AUTH_BASE_URL = `${API_BASE}/auth/`;
export const SHOPKEEPER_BASE_URL = `${API_BASE}/provider/`;
export const AUDIT_LOGS_BASE_URL = `${API_BASE}/audit-log/`;
export const SERVICE_PROVIDER = "SERVICE_PROVIDER";
