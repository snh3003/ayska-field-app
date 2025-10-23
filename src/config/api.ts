// API Configuration - Centralized configuration for all API calls
// Base URL, timeout, retry settings, and other API-related constants

export const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: 'http://localhost:8000/api/v1',

  // Request timeout in milliseconds (15 seconds)
  TIMEOUT: 15000,

  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 1000, // 1 second base delay
    RETRY_DELAY_MAX: 4000, // 4 seconds max delay
    RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
  },

  // Throttling configuration
  THROTTLE: {
    MAX_REQUESTS_PER_MINUTE: 60,
    RATE_LIMIT_STATUS: 429,
    DEFAULT_RETRY_AFTER: 60, // seconds
  },

  // Network detection thresholds
  NETWORK: {
    WEAK_NETWORK_THRESHOLD: 5000, // ms - if request takes longer, consider weak network
    CONSECUTIVE_TIMEOUT_THRESHOLD: 3, // After 3 consecutive timeouts, mark as weak network
  },

  // Endpoint paths (for reference and type safety)
  ENDPOINTS: {
    // Auth
    AUTH_OTP_REQUEST: '/auth/otp/request',
    AUTH_OTP_VERIFY: '/auth/otp/verify',
    AUTH_PROFILE: '/auth/profile',
    AUTH_LOGOUT: '/auth/logout',

    // Admin - Employees
    ADMIN_EMPLOYEES: '/admin/employees',
    ADMIN_EMPLOYEE_BY_ID: (id: string) => `/admin/employees/${id}`,
    ADMIN_EMPLOYEE_REACTIVATE: (id: string) =>
      `/admin/employees/${id}/reactivate`,

    // Admin - Doctors
    ADMIN_DOCTORS: '/admin/doctors',
    ADMIN_DOCTOR_BY_ID: (id: string) => `/admin/doctors/${id}`,

    // Admin - Assignments
    ADMIN_ASSIGNMENTS: '/admin/assignments',
    ADMIN_ASSIGNMENT_BY_ID: (id: string) => `/admin/assignments/${id}`,
    ADMIN_ASSIGNMENT_PROGRESS: (id: string) =>
      `/admin/assignments/${id}/progress`,
    ADMIN_ASSIGNMENT_STATUS: (id: string) => `/admin/assignments/${id}/status`,

    // Employee
    EMPLOYEE_ASSIGNMENTS: '/employee/assignments',
    EMPLOYEE_CHECKIN: '/employee/checkin',
    EMPLOYEE_CHECKIN_HISTORY: '/employee/checkin/history',
    EMPLOYEE_DOCTORS: '/employee/doctors',
    EMPLOYEE_DOCTOR_BY_ID: (id: string) => `/employee/doctors/${id}`,
    EMPLOYEE_PROFILE: '/employee/profile',

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
    NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
    NOTIFICATIONS_BULK_READ: '/notifications/bulk/read',
    NOTIFICATIONS_ALL_READ: '/notifications/all/read',
    NOTIFICATIONS_STATS: '/notifications/stats',

    // Analytics
    ANALYTICS_DASHBOARD: '/analytics/dashboard',
    ANALYTICS_KPIS: '/analytics/kpis',
    ANALYTICS_EMPLOYEES_PERFORMANCE: '/analytics/employees/performance',
    ANALYTICS_EMPLOYEE_PERFORMANCE: (id: string) =>
      `/analytics/employees/${id}/performance`,
    ANALYTICS_ASSIGNMENTS: '/analytics/assignments',
    ANALYTICS_CHECKINS: '/analytics/checkins',
    ANALYTICS_TRENDS_DAILY: '/analytics/trends/daily',
    ANALYTICS_TRENDS_WEEKLY: '/analytics/trends/weekly',
    ANALYTICS_REPORTS_GENERATE: '/analytics/reports/generate',
    ANALYTICS_EXPORT_CSV: '/analytics/export/csv',
    ANALYTICS_SYSTEM_HEALTH: '/analytics/system/health',
  },
} as const;

// Helper function to get full API URL
export const getFullApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to calculate exponential backoff delay
export const getRetryDelay = (attemptNumber: number): number => {
  const delay = Math.min(
    API_CONFIG.RETRY.RETRY_DELAY_BASE * Math.pow(2, attemptNumber - 1),
    API_CONFIG.RETRY.RETRY_DELAY_MAX
  );
  return delay;
};

// Helper function to check if status code is retryable
export const isRetryableStatusCode = (statusCode: number): boolean => {
  return API_CONFIG.RETRY.RETRYABLE_STATUS_CODES.includes(statusCode);
};
