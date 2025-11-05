/**
 * Application configuration constants
 */

export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7071/api',
  API_TIMEOUT: 30000,
  ARCGIS_API_VERSION: '4.31',
} as const;

export const ROUTES = {
  HOME: '/',
} as const;

export const STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
} as const;
