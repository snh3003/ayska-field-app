import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
import { ApiError } from '../utils/AyskaApiErrorHandlerUtil';
import { getRetryDelay, isRetryableStatusCode } from '../config/api';

export class RetryInterceptor implements IHttpInterceptor {
  private maxRetries: number;
  private consecutiveTimeouts: number = 0;
  private weakNetworkThreshold: number = 3;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
  }

  onError(error: (AxiosError & { config: any }) | ApiError): any {
    // Guard: Check if error is already an ApiError (skip retry, pass through)
    if (
      error &&
      typeof error === 'object' &&
      typeof (error as ApiError).code === 'number' &&
      typeof (error as ApiError).message === 'string' &&
      typeof (error as ApiError).title === 'string' &&
      !(error as AxiosError).config &&
      !(error as AxiosError).response
    ) {
      // Already mapped - pass through without retry
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('⚠️ RETRY: Already-mapped error, passing to ErrorInterceptor');
      }
      return error;
    }

    // Debug: Check what RetryInterceptor receives
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🔄 RETRY INTERCEPTOR RECEIVED:', {
        hasConfig: !!(error as AxiosError).config,
        hasResponse: !!(error as AxiosError).response,
        errorCode: (error as AxiosError).code,
        errorMessage: (error as AxiosError).message,
      });
    }

    const axiosError = error as AxiosError & { config: any };
    const originalRequest = axiosError.config;

    // Guard against undefined config - pass to next interceptor
    if (!originalRequest) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('⚠️ RETRY: No config, passing to ErrorInterceptor');
      }
      return error;
    }

    const status = axiosError.response?.status;

    // Check if this is a retryable error
    const isNetworkOr5xx = !axiosError.response || (status ? status >= 500 : false);
    const isRetryable = isNetworkOr5xx || (status ? isRetryableStatusCode(status) : false);
    const retryCount = originalRequest.__retryCount || 0;

    // Handle throttling (429) with Retry-After header
    if (status === 429) {
      const retryAfter = axiosError.response?.headers?.['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : getRetryDelay(retryCount + 1);

      if (retryCount < this.maxRetries) {
        originalRequest.__isRetry = true;
        originalRequest.__retryCount = retryCount + 1;

        // Wait for the specified delay before retrying
        return new Promise((resolve) => {
          setTimeout(() => resolve(originalRequest), delay);
        });
      }
    }

    // Handle network/5xx errors with exponential backoff
    if (isRetryable && retryCount < this.maxRetries) {
      // Track consecutive timeouts for weak network detection
      if (axiosError.code === 'TIMEOUT' || axiosError.message?.includes('timeout')) {
        this.consecutiveTimeouts++;

        // Mark as weak network if too many consecutive timeouts
        if (this.consecutiveTimeouts >= this.weakNetworkThreshold) {
          axiosError.code = 'WEAK_NETWORK';
        }
      } else {
        this.consecutiveTimeouts = 0; // Reset on successful request
      }

      originalRequest.__isRetry = true;
      originalRequest.__retryCount = retryCount + 1;

      // Calculate exponential backoff delay
      const delay = getRetryDelay(retryCount + 1);

      return new Promise((resolve) => {
        setTimeout(() => resolve(originalRequest), delay);
      });
    }

    // Reset consecutive timeouts on non-retryable errors
    this.consecutiveTimeouts = 0;

    // Pass error to next interceptor unchanged (don't wrap in Promise)
    return error;
  }

  /**
   * Reset consecutive timeout counter (call on successful requests)
   */
  resetConsecutiveTimeouts(): void {
    this.consecutiveTimeouts = 0;
  }

  /**
   * Check if we're in a weak network state
   */
  isWeakNetwork(): boolean {
    return this.consecutiveTimeouts >= this.weakNetworkThreshold;
  }
}
