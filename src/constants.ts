// API Base URL - Uses environment variable or defaults to localhost
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AUTH_BASE_URL = `${API_BASE}/auth/`;
export const SHOPKEEPER_BASE_URL = `${API_BASE}/provider/`;
export const AUDIT_LOGS_BASE_URL = `${API_BASE}/audit-log/`;
export const SERVICE_PROVIDER = "SERVICE_PROVIDER";
