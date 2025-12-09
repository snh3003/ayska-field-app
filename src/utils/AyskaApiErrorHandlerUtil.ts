// API Error Handler Utility - Maps backend error codes to user-friendly messages
// Centralized error handling for consistent UX across the app

export interface ApiError {
  code: number;
  message: string;
  title: string;
  details?: string;
}

export interface ApiErrorResponse {
  status: number;
  data?: {
    message?: string;
    detail?: string;
    errors?: Record<string, string[]>;
  };
}

// Error code mapping from backend to user-friendly messages
const ERROR_MESSAGES: Record<number | string, { title: string; message: string }> = {
  400: {
    title: 'Invalid Request',
    message: 'Please check your input and try again',
  },
  401: {
    title: 'Session Expired',
    message: 'Your session has expired. Please login again',
  },
  403: {
    title: 'Access Denied',
    message: "You don't have permission to perform this action",
  },
  404: {
    title: 'Not Found',
    message: 'The requested resource was not found',
  },
  409: {
    title: 'Conflict',
    message: 'This resource already exists',
  },
  422: {
    title: 'Validation Error',
    message: 'Please check your input and try again',
  },
  429: {
    title: 'Too Many Requests',
    message: 'You are making requests too quickly. Please wait a moment.',
  },
  500: {
    title: 'Server Error',
    message: 'Something went wrong. Please try again later',
  },
  502: {
    title: 'Server Down',
    message: 'The server is temporarily unavailable. Please try again later',
  },
  503: {
    title: 'Service Unavailable',
    message: 'The service is temporarily unavailable. Please try again later',
  },
  504: {
    title: 'Gateway Timeout',
    message: 'The server took too long to respond. Please try again',
  },
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Please check your internet connection and try again',
  },
  SERVER_DOWN: {
    title: 'Server Unavailable',
    message: 'The server is currently down. Please try again later',
  },
  THROTTLING: {
    title: 'Rate Limited',
    message: 'Too many requests. Please wait before trying again',
  },
  WEAK_NETWORK: {
    title: 'Poor Connection',
    message: 'Your connection seems weak. Please check your network',
  },
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request took too long. Please try again',
  },
  UNKNOWN_ERROR: {
    title: 'Error',
    message: 'An unexpected error occurred. Please try again',
  },
};

// OTP-specific error messages
const OTP_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  INVALID_OTP: {
    title: 'Invalid Code',
    message: 'The verification code you entered is incorrect. Please try again',
  },
  EXPIRED_OTP: {
    title: 'Code Expired',
    message: 'The verification code has expired. Please request a new one',
  },
  OTP_NOT_FOUND: {
    title: 'Code Not Found',
    message: 'No verification code found. Please request a new one',
  },
  TOO_MANY_ATTEMPTS: {
    title: 'Too Many Attempts',
    message: 'You have made too many attempts. Please wait before trying again',
  },
};

// Employee-specific error messages
const EMPLOYEE_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  EMPLOYEE_NOT_FOUND: {
    title: 'Employee Not Found',
    message: 'The requested employee was not found',
  },
  EMPLOYEE_ALREADY_EXISTS: {
    title: 'Employee Exists',
    message: 'An employee with this email or phone already exists',
  },
  EMPLOYEE_INACTIVE: {
    title: 'Employee Inactive',
    message: 'This employee account is currently inactive',
  },
  EMPLOYEE_ALREADY_ACTIVE: {
    title: 'Employee Already Active',
    message: 'This employee is already active',
  },
};

// Doctor-specific error messages (reserved for future use)
// @ts-expect-error - Reserved for future feature implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _DOCTOR_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  DOCTOR_NOT_FOUND: {
    title: 'Doctor Not Found',
    message: 'The requested doctor was not found',
  },
  DUPLICATE_DOCTOR: {
    title: 'Doctor Already Exists',
    message: 'A doctor with this email or phone already exists',
  },
};

// Assignment-specific error messages (reserved for future use)
// @ts-expect-error - Reserved for future feature implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ASSIGNMENT_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  ASSIGNMENT_NOT_FOUND: {
    title: 'Assignment Not Found',
    message: 'The requested assignment was not found',
  },
  DUPLICATE_ASSIGNMENT: {
    title: 'Assignment Already Exists',
    message: 'This employee already has an active assignment with this doctor',
  },
};

// Check-in specific error messages (reserved for future use)
// @ts-expect-error - Reserved for future feature implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _CHECKIN_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  DISTANCE_EXCEEDED: {
    title: 'Too Far Away',
    message: 'You are too far from the doctor location. Please move closer.',
  },
  NO_ACTIVE_ASSIGNMENT: {
    title: 'No Active Assignment',
    message: 'You do not have an active assignment with this doctor',
  },
};

// Notification-specific error messages (reserved for future use)
// @ts-expect-error - Reserved for future feature implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _NOTIFICATION_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  NOTIFICATION_NOT_FOUND: {
    title: 'Notification Not Found',
    message: 'The requested notification was not found',
  },
};

export class ApiErrorHandler {
  /**
   * Maps API error response to user-friendly error object
   * Prioritizes backend error messages over hardcoded ones
   */
  static mapError(error: any): ApiError {
    // Guard: Check if error is already an ApiError (prevent re-mapping)
    if (
      error &&
      typeof error === 'object' &&
      typeof error.code === 'number' &&
      typeof error.message === 'string' &&
      typeof error.title === 'string' &&
      !error.response &&
      !error.config
    ) {
      // Already mapped - return as-is
      return error as ApiError;
    }

    // Network errors - enhanced detection for corrupted error objects
    if (!error.response) {
      // Helper function to detect if error object is corrupted (has non-standard keys)
      const isCorruptedError = (err: any): boolean => {
        if (!err || typeof err !== 'object') return false;
        const keys = Object.keys(err);
        // Corrupted objects often have keys like _h, _i, _j, _k (minified/internal properties)
        const hasCorruptedKeys = keys.some((key) => key.startsWith('_') && key.length <= 2);
        // Also check if it has no standard error properties
        const hasNoStandardProps = !err.code && !err.message && !err.response && !err.config;
        return hasCorruptedKeys || (hasNoStandardProps && keys.length > 0);
      };

      // Helper function to extract error information from corrupted objects
      const getErrorInfo = (err: any): { code?: string; message?: string } => {
        const info: { code?: string; message?: string } = {};

        // Direct property access
        if (err.code) info.code = String(err.code);
        if (err.message) info.message = String(err.message);

        // Check stringified error for network indicators
        try {
          const errorString = JSON.stringify(err).toLowerCase();
          if (errorString.includes('err_network') || errorString.includes('network error')) {
            info.code = info.code || 'ERR_NETWORK';
            info.message = info.message || 'Network Error';
          }
          if (errorString.includes('econnrefused') || errorString.includes('server is down')) {
            info.code = info.code || 'ECONNREFUSED';
            info.message = info.message || 'Server is down';
          }
        } catch {
          // Ignore JSON stringify errors
        }

        // Check object keys for network error patterns (handle corrupted objects with _h, _i, etc.)
        const keys = Object.keys(err);
        for (const key of keys) {
          const value = err[key];
          if (typeof value === 'string') {
            const lowerValue = value.toLowerCase();
            if (lowerValue.includes('err_network') || lowerValue.includes('network error')) {
              info.code = info.code || 'ERR_NETWORK';
              info.message = info.message || 'Network Error';
            }
            if (lowerValue.includes('econnrefused') || lowerValue.includes('server is down')) {
              info.code = info.code || 'ECONNREFUSED';
              info.message = info.message || 'Server is down';
            }
          }
        }

        return info;
      };

      const errorInfo = getErrorInfo(error);
      const errorCode = errorInfo.code || error.code;
      const errorMessage = errorInfo.message || error.message || '';

      // CRITICAL FIX: If error object is corrupted and has no response, treat as network error
      // This handles cases where error object loses its properties during retry process
      if (isCorruptedError(error) && !errorCode && !errorMessage) {
        // Corrupted error with no response = network/server error
        // Default to network error (most common case)
        const networkError = ERROR_MESSAGES.NETWORK_ERROR;
        return {
          code: 0,
          message: networkError?.message || 'Network error',
          title: networkError?.title || 'Connection Error',
        };
      }

      // Server down detection - enhanced
      if (
        errorCode === 'ECONNREFUSED' ||
        errorMessage?.includes('ECONNREFUSED') ||
        errorMessage?.includes('Server is down') ||
        errorMessage?.includes('Server Unavailable') ||
        (typeof errorCode === 'string' && errorCode.toLowerCase().includes('econnrefused'))
      ) {
        const serverDownError = ERROR_MESSAGES.SERVER_DOWN;
        return {
          code: 0,
          message: serverDownError?.message || 'Server is down',
          title: serverDownError?.title || 'Server Unavailable',
        };
      }

      // Network error detection - enhanced
      if (
        errorCode === 'NETWORK_ERROR' ||
        errorCode === 'ERR_NETWORK' ||
        errorMessage?.includes('Network Error') ||
        errorMessage?.includes('ERR_NETWORK') ||
        (typeof errorCode === 'string' && errorCode.toLowerCase().includes('network'))
      ) {
        const networkError = ERROR_MESSAGES.NETWORK_ERROR;
        return {
          code: 0,
          message: networkError?.message || 'Network error',
          title: networkError?.title || 'Connection Error',
        };
      }

      // Timeout detection - enhanced
      if (
        errorCode === 'TIMEOUT' ||
        error.code === 'TIMEOUT' ||
        errorMessage?.includes('timeout') ||
        error.message?.includes('timeout')
      ) {
        const timeoutError = ERROR_MESSAGES.TIMEOUT_ERROR;
        return {
          code: 0,
          message: timeoutError?.message || 'Request timeout',
          title: timeoutError?.title || 'Timeout Error',
        };
      }

      // Weak network detection (consecutive timeouts)
      if (errorCode === 'WEAK_NETWORK' || error.code === 'WEAK_NETWORK') {
        const weakNetworkError = ERROR_MESSAGES.WEAK_NETWORK;
        return {
          code: 0,
          message: weakNetworkError?.message || 'Poor connection',
          title: weakNetworkError?.title || 'Poor Connection',
        };
      }

      const unknownError = ERROR_MESSAGES.UNKNOWN_ERROR;
      return {
        code: 0,
        message: unknownError?.message || 'Unknown error',
        title: unknownError?.title || 'Error',
      };
    }

    const status = error.response?.status || 500;
    const data = error.response?.data || {};

    // Throttling detection (429 status)
    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      const throttlingError = ERROR_MESSAGES.THROTTLING;
      return {
        code: status,
        title: throttlingError?.title || 'Rate Limited',
        message: retryAfter
          ? `Too many requests. Please wait ${retryAfter} seconds.`
          : throttlingError?.message || 'Too many requests',
        details: retryAfter ? `Retry after: ${retryAfter}s` : undefined,
      };
    }

    // PRIORITIZE BACKEND ERROR MESSAGES
    // Priority order:
    // 1. data.message (highest priority - from API)
    // 2. data.detail (for auth errors like 401/403)
    // 3. mapBackendErrorCode(data.error) if message not available
    // 4. Hardcoded fallback messages

    // Use backend message field as PRIMARY message (highest priority)
    if (data.message) {
      // If we have both error code and message, use message but get title from error code if helpful
      let title = this.getTitleFromMessage(data.message, status);

      // If error code exists, try to get a better title from it
      if (data.error) {
        const backendError = this.mapBackendErrorCode(data.error, data.message);
        if (backendError) {
          // Use error code mapping for title, but keep API message
          title = backendError.title;
        }
      }

      return {
        code: status,
        title,
        message: data.message, // Always use API's message field
        ...(data.errors && { details: JSON.stringify(data.errors) }),
      };
    }

    // Handle data.detail field (used in 401/403 responses)
    if (data.detail) {
      // Handle array format (FastAPI validation errors)
      if (Array.isArray(data.detail)) {
        const fieldErrors = data.detail
          .map((err: any) => {
            const field = err.loc?.[err.loc.length - 1] || 'field';
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            return `${fieldName}: ${err.msg}`;
          })
          .join('\n');

        return {
          code: status,
          title: 'Validation Error',
          message: fieldErrors || 'Please check your input',
          ...(data.errors && { details: JSON.stringify(data.errors) }),
        };
      }

      // Handle object format (nested error objects with message/error properties)
      if (typeof data.detail === 'object' && data.detail !== null && !Array.isArray(data.detail)) {
        // Extract message from nested object
        const detailMessage = (data.detail as any).message;
        const detailError = (data.detail as any).error;

        if (detailMessage) {
          // Use message from detail object
          let title = this.getTitleFromMessage(detailMessage, status);

          // If error code exists in detail, try to get a better title from it
          if (detailError) {
            const backendError = this.mapBackendErrorCode(detailError, detailMessage);
            if (backendError) {
              title = backendError.title;
            }
          }

          return {
            code: status,
            title,
            message: detailMessage,
            ...(data.errors && { details: JSON.stringify(data.errors) }),
          };
        }
        // If no message in object, fall through to string conversion
      }

      // Handle string format (auth errors)
      return {
        code: status,
        title: this.getTitleFromMessage(String(data.detail), status),
        message: String(data.detail),
        ...(data.errors && { details: JSON.stringify(data.errors) }),
      };
    }

    // Check for backend error field (only if message/detail not available)
    if (data.error) {
      const backendError = this.mapBackendErrorCode(data.error, data.message);
      if (backendError) {
        return {
          code: status,
          title: backendError.title,
          message: backendError.message,
          ...(data.errors && { details: JSON.stringify(data.errors) }),
        };
      }
    }

    // Fall back to hardcoded messages only if backend doesn't provide them
    const baseError = ERROR_MESSAGES[status] || ERROR_MESSAGES.UNKNOWN_ERROR;
    const specificMessage = this.getSpecificErrorMessage(data, status);

    return {
      code: status,
      title: specificMessage?.title || baseError?.title || 'Error',
      message: specificMessage?.message || baseError?.message || 'Unknown error',
      ...(data.errors && { details: JSON.stringify(data.errors) }),
    };
  }

  /**
   * Maps backend error codes to user-friendly messages
   */
  private static mapBackendErrorCode(
    errorCode: string,
    _message?: string,
  ): { title: string; message: string } | null {
    const backendErrorMap: Record<string, { title: string; message: string }> = {
      // Authentication errors
      invalid_otp: {
        title: 'Invalid Code',
        message: 'Incorrect OTP. Try again.',
      },
      otp_expired: {
        title: 'Code Expired',
        message: 'OTP expired. Request a new one.',
      },
      too_many_attempts: {
        title: 'Too Many Attempts',
        message: 'Too many attempts. Request new OTP.',
      },
      user_not_found: {
        title: 'Account Not Found',
        message: 'Account not found. Contact your admin.',
      },
      account_inactive: {
        title: 'Account Inactive',
        message: 'Account deactivated. Contact your admin.',
      },

      // Employee errors
      duplicate_employee: {
        title: 'Duplicate Account',
        message: 'Email or phone already exists.',
      },
      employee_not_found: {
        title: 'Employee Not Found',
        message: 'Employee not found.',
      },
      employee_already_active: {
        title: 'Employee Already Active',
        message: 'Employee is already active.',
      },
      duplicate_contact: {
        title: 'Contact Already Exists',
        message: 'Email or phone already in use.',
      },

      // Doctor errors
      duplicate_doctor: {
        title: 'Doctor Already Exists',
        message: 'A doctor with this email or phone already exists.',
      },
      duplicate_doctor_phone: {
        title: 'Doctor Phone Exists',
        message: 'Doctor with this phone already exists.',
      },
      doctor_not_found: {
        title: 'Doctor Not Found',
        message: 'Doctor not found.',
      },

      // Assignment errors
      duplicate_assignment: {
        title: 'Assignment Already Exists',
        message: 'Employee already has an active assignment with this doctor.',
      },
      assignment_exists: {
        title: 'Assignment Exists',
        message: 'Active assignment already exists for this employee-doctor pair.',
      },
      assignment_not_found: {
        title: 'Assignment Not Found',
        message: 'Assignment not found.',
      },
      invalid_progress: {
        title: 'Invalid Progress',
        message: 'Progress cannot exceed target.',
      },
      invalid_status_change: {
        title: 'Invalid Status Change',
        message: 'Cannot reactivate completed assignment.',
      },

      // Check-in errors
      distance_exceeded: {
        title: 'Too Far Away',
        message: 'You are too far from the doctor location. Please move closer.',
      },

      // Notification errors
      notification_not_found: {
        title: 'Notification Not Found',
        message: 'Notification not found.',
      },
    };

    return backendErrorMap[errorCode] || null;
  }

  /**
   * Gets title from backend message
   */
  private static getTitleFromMessage(message: string, status: number): string {
    if (message.includes('OTP') || message.includes('verification')) {
      return 'Verification Error';
    }
    if (message.includes('employee')) {
      return 'Employee Error';
    }
    if (message.includes('permission') || message.includes('access')) {
      return 'Access Denied';
    }
    if (status === 401) {
      return 'Authentication Error';
    }
    if (status === 403) {
      return 'Access Denied';
    }
    if (status === 404) {
      return 'Not Found';
    }
    if (status === 422) {
      return 'Validation Error';
    }
    return 'Error';
  }

  /**
   * Gets specific error message based on response data
   */
  private static getSpecificErrorMessage(
    data: any,
    status: number,
  ): { title: string; message: string } | null {
    const message = data.message || data.detail || '';

    // OTP-specific errors
    if (message.includes('OTP') || message.includes('verification code')) {
      if (message.includes('invalid') || message.includes('incorrect')) {
        return OTP_ERROR_MESSAGES.INVALID_OTP || null;
      }
      if (message.includes('expired')) {
        return OTP_ERROR_MESSAGES.EXPIRED_OTP || null;
      }
      if (message.includes('not found')) {
        return OTP_ERROR_MESSAGES.OTP_NOT_FOUND || null;
      }
      if (message.includes('too many') || message.includes('attempts')) {
        return OTP_ERROR_MESSAGES.TOO_MANY_ATTEMPTS || null;
      }
    }

    // Employee-specific errors
    if (message.includes('employee')) {
      if (message.includes('not found')) {
        return EMPLOYEE_ERROR_MESSAGES.EMPLOYEE_NOT_FOUND || null;
      }
      if (message.includes('already exists') || message.includes('duplicate')) {
        return EMPLOYEE_ERROR_MESSAGES.EMPLOYEE_ALREADY_EXISTS || null;
      }
      if (message.includes('inactive')) {
        return EMPLOYEE_ERROR_MESSAGES.EMPLOYEE_INACTIVE || null;
      }
    }

    // Enhanced 422 validation error handling (FastAPI format)
    if (status === 422 && Array.isArray(data.detail)) {
      const fieldErrors = data.detail
        .map((err: any) => {
          const field = err.loc?.[err.loc.length - 1] || 'field';
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          return `${fieldName}: ${err.msg}`;
        })
        .join('\n');

      return {
        title: 'Validation Error',
        message: fieldErrors || 'Please check your input',
      };
    }

    // Validation errors (422) - alternative format
    if (status === 422 && data.errors) {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return {
          title: 'Validation Error',
          message: firstError[0],
        };
      }
    }

    return null;
  }

  /**
   * Checks if error is retryable
   */
  static isRetryable(error: ApiError): boolean {
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(error.code) || error.code === 0; // Network errors
  }

  /**
   * Checks if error indicates server is down
   */
  static isServerDown(error: ApiError): boolean {
    return (
      error.code === 0 &&
      (error.message?.includes('Server is down') ||
        error.message?.includes('ECONNREFUSED') ||
        error.title?.includes('Server Unavailable'))
    );
  }

  /**
   * Checks if error indicates throttling
   */
  static isThrottling(error: ApiError): boolean {
    return error.code === 429 || error.title?.includes('Rate Limited');
  }

  /**
   * Checks if error indicates weak network
   */
  static isWeakNetwork(error: ApiError): boolean {
    return (
      error.code === 0 &&
      (error.title?.includes('Poor Connection') || error.message?.includes('weak'))
    );
  }

  /**
   * Gets retry delay in milliseconds
   */
  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt - 1), 16000);
  }

  /**
   * Formats error for logging
   */
  static formatForLogging(error: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';

    if (error.response) {
      return `${timestamp}${contextStr} API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    }

    return `${timestamp}${contextStr} Network Error: ${error.message || 'Unknown error'}`;
  }
}

// Convenience function for quick error mapping
export const mapApiError = (error: any): ApiError => ApiErrorHandler.mapError(error);

// Convenience function for checking retryability
export const isRetryableError = (error: ApiError): boolean => ApiErrorHandler.isRetryable(error);
