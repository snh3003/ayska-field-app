import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
import { ApiError, ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
// ServiceContainer imported lazily to avoid circular dependencies

export class ErrorInterceptor implements IHttpInterceptor {
  private onUnauthorized: () => void;
  private onErrorCallback?: (_error: ApiError) => void;
  private authStorage: any;

  constructor(onUnauthorized: () => void, onErrorCallback?: (_error: ApiError) => void) {
    this.onUnauthorized = onUnauthorized;
    this.onErrorCallback = onErrorCallback || (() => {});
    // Get auth storage service for logout handling - lazy import to avoid circular dependencies
    this.authStorage = null; // Will be initialized when needed
  }

  onError(error: AxiosError | ApiError): any {
    // Guard: Check if error is already an ApiError (prevent re-mapping)
    if (
      error &&
      typeof error === 'object' &&
      typeof (error as ApiError).code === 'number' &&
      typeof (error as ApiError).message === 'string' &&
      typeof (error as ApiError).title === 'string' &&
      !(error as AxiosError).response &&
      !(error as AxiosError).config
    ) {
      // Already mapped - just show toast and return
      const apiError = error as ApiError;

      // Handle authentication errors
      if (apiError.code === 401) {
        const message = apiError.message?.toLowerCase() || '';
        const isRoleError =
          message.includes('access required') ||
          message.includes('admin access') ||
          message.includes('employee access');

        if (!isRoleError) {
          this.handleUnauthorized();
        }
      }

      // Show user-friendly error message
      if (this.onErrorCallback && apiError.code !== 401) {
        this.onErrorCallback(apiError);
      }

      return Promise.reject(apiError);
    }

    // Debug: Log the raw error to see what we're receiving
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🔍 RAW ERROR RECEIVED:', {
        hasConfig: !!(error as AxiosError).config,
        hasResponse: !!(error as AxiosError).response,
        errorType: typeof error,
        errorKeys: Object.keys(error),
        isAxiosError: (error as AxiosError).isAxiosError,
        rawError: error,
      });
    }

    const mappedError = ApiErrorHandler.mapError(error);

    // Handle authentication errors - distinguish auth failure from role denial
    if (mappedError.code === 401) {
      const message = mappedError.message?.toLowerCase() || '';
      const detail = ((error as AxiosError).response?.data as any)?.detail?.toLowerCase() || '';

      // Check if this is a role-based access denial (don't logout)
      const isRoleError =
        message.includes('access required') ||
        detail.includes('access required') ||
        message.includes('admin access') ||
        message.includes('employee access');

      if (!isRoleError) {
        // Real authentication failure - logout
        this.handleUnauthorized();
      }
      // If role error, just show toast (already handled by onErrorCallback)
    }

    // Handle specific backend error codes
    this.handleSpecificErrors(mappedError);

    // Show user-friendly error message
    if (this.onErrorCallback) {
      this.onErrorCallback(mappedError);
    }

    // Enhanced logging for debugging (solo developer)
    if (__DEV__) {
      const axiosError = error as AxiosError;
      const method = axiosError.config?.method?.toUpperCase() || 'UNKNOWN';
      const url = axiosError.config?.url || 'UNKNOWN';
      const baseURL = axiosError.config?.baseURL || '';
      const fullURL = baseURL && url !== 'UNKNOWN' ? `${baseURL}${url}` : 'UNKNOWN';

      // eslint-disable-next-line no-console
      console.group(`🔴 API ERROR: ${method} ${url}`);
      // eslint-disable-next-line no-console
      console.log('📊 Status Code:', axiosError.response?.status || 'No Response');
      // eslint-disable-next-line no-console
      console.log(
        '📦 Response Data:',
        axiosError.response?.data
          ? JSON.stringify(axiosError.response.data, null, 2)
          : 'No response data',
      );
      // eslint-disable-next-line no-console
      console.log('📋 Request Data:', axiosError.config?.data || 'No request data');
      // eslint-disable-next-line no-console
      console.log('🔗 Full URL:', fullURL);
      // eslint-disable-next-line no-console
      console.log('⏱️ Timestamp:', new Date().toISOString());
      // eslint-disable-next-line no-console
      console.log('💬 User Message:', mappedError.message);
      // eslint-disable-next-line no-console
      console.log('🔧 Error Type:', axiosError.code || 'No error code');
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    return Promise.reject(mappedError);
  }

  /**
   * Handle 401 unauthorized errors
   */
  private async handleUnauthorized(): Promise<void> {
    // Initialize authStorage lazily to avoid circular dependencies
    if (!this.authStorage) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ServiceContainer } = require('../di/ServiceContainer');
      this.authStorage = ServiceContainer.getInstance().get('IAuthStorage');
    }

    // Clear all auth data
    if (this.authStorage) {
      await this.authStorage.clearAll();
    }

    // Trigger logout action
    this.onUnauthorized();
  }

  /**
   * Handle specific backend error scenarios
   */
  private handleSpecificErrors(error: ApiError): void {
    // Handle OTP-specific errors
    if (error.message.includes('OTP') || error.message.includes('verification')) {
      // OTP errors are handled by the login screen
      return;
    }

    // Handle employee-specific errors
    if (error.message.includes('employee') || error.message.includes('Employee')) {
      // Employee errors are handled by the respective screens
      return;
    }

    // Handle network errors
    if (error.code === 0) {
      // Network errors are handled by retry logic
      return;
    }

    // Handle server errors
    if (error.code >= 500) {
      // Server errors are handled by retry logic
      return;
    }
  }

  /**
   * Enhanced error handling with retry logic
   */
  async onErrorAsync(error: AxiosError): Promise<any> {
    const mappedError = ApiErrorHandler.mapError(error);

    // Check if error is retryable
    if (ApiErrorHandler.isRetryable(mappedError)) {
      // Implement retry logic here if needed
      // For now, just return the mapped error
    }

    return this.onError(error);
  }
}
