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
const ERROR_MESSAGES: Record<
  number | string,
  { title: string; message: string }
> = {
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
  500: {
    title: 'Server Error',
    message: 'Something went wrong. Please try again later',
  },
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Please check your internet connection and try again',
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
const EMPLOYEE_ERROR_MESSAGES: Record<
  string,
  { title: string; message: string }
> = {
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
};

export class ApiErrorHandler {
  /**
   * Maps API error response to user-friendly error object
   * Prioritizes backend error messages over hardcoded ones
   */
  static mapError(error: any): ApiError {
    // Network errors
    if (!error.response) {
      if (
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('Network Error')
      ) {
        const networkError = ERROR_MESSAGES.NETWORK_ERROR;
        return {
          code: 0,
          message: networkError?.message || 'Network error',
          title: networkError?.title || 'Connection Error',
        };
      }

      if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
        const timeoutError = ERROR_MESSAGES.TIMEOUT_ERROR;
        return {
          code: 0,
          message: timeoutError?.message || 'Request timeout',
          title: timeoutError?.title || 'Timeout Error',
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

    // PRIORITIZE BACKEND ERROR MESSAGES
    // Check for backend error field first (error.response.data.error)
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

    // Use backend message field as primary message
    if (data.message) {
      return {
        code: status,
        title: this.getTitleFromMessage(data.message, status),
        message: data.message,
        ...(data.errors && { details: JSON.stringify(data.errors) }),
      };
    }

    // Fall back to hardcoded messages only if backend doesn't provide them
    const baseError = ERROR_MESSAGES[status] || ERROR_MESSAGES.UNKNOWN_ERROR;
    const specificMessage = this.getSpecificErrorMessage(data, status);

    return {
      code: status,
      title: specificMessage?.title || baseError?.title || 'Error',
      message:
        specificMessage?.message ||
        data.detail ||
        baseError?.message ||
        'Unknown error',
      ...(data.errors && { details: JSON.stringify(data.errors) }),
    };
  }

  /**
   * Maps backend error codes to user-friendly messages
   */
  private static mapBackendErrorCode(
    errorCode: string,
    _message?: string
  ): { title: string; message: string } | null {
    const backendErrorMap: Record<string, { title: string; message: string }> =
      {
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
        duplicate_employee: {
          title: 'Duplicate Account',
          message: 'Email or phone already exists.',
        },
        employee_not_found: {
          title: 'Employee Not Found',
          message: 'Employee not found.',
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
    status: number
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

    // Validation errors (422)
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
export const mapApiError = (error: any): ApiError =>
  ApiErrorHandler.mapError(error);

// Convenience function for checking retryability
export const isRetryableError = (error: ApiError): boolean =>
  ApiErrorHandler.isRetryable(error);
