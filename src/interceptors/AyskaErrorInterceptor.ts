import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
import { ApiError, ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
// ServiceContainer imported lazily to avoid circular dependencies

export class ErrorInterceptor implements IHttpInterceptor {
  private onUnauthorized: () => void;
  private onErrorCallback?: (_error: ApiError) => void;
  private authStorage: any;

  constructor(
    onUnauthorized: () => void,
    onErrorCallback?: (_error: ApiError) => void
  ) {
    this.onUnauthorized = onUnauthorized;
    this.onErrorCallback = onErrorCallback || (() => {});
    // Get auth storage service for logout handling - lazy import to avoid circular dependencies
    this.authStorage = null; // Will be initialized when needed
  }

  onError(error: AxiosError): any {
    const mappedError = ApiErrorHandler.mapError(error);

    // Handle authentication errors
    if (mappedError.code === 401) {
      this.handleUnauthorized();
    }

    // Handle specific backend error codes
    this.handleSpecificErrors(mappedError);

    // Show user-friendly error message
    if (this.onErrorCallback) {
      this.onErrorCallback(mappedError);
    }

    // Log error for debugging
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(
        'API Error:',
        ApiErrorHandler.formatForLogging(error, 'ErrorInterceptor')
      );
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
    if (
      error.message.includes('OTP') ||
      error.message.includes('verification')
    ) {
      // OTP errors are handled by the login screen
      return;
    }

    // Handle employee-specific errors
    if (
      error.message.includes('employee') ||
      error.message.includes('Employee')
    ) {
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
