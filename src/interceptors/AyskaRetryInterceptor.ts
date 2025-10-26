import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
import { getRetryDelay, isRetryableStatusCode } from '../config/api';

export class RetryInterceptor implements IHttpInterceptor {
  private maxRetries: number;
  private consecutiveTimeouts: number = 0;
  private weakNetworkThreshold: number = 3;

  constructor(maxRetries: number = 3) {
    this.maxRetries = maxRetries;
  }

  onError(error: AxiosError & { config: any }): any {
    // Debug: Check what RetryInterceptor receives
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🔄 RETRY INTERCEPTOR RECEIVED:', {
        hasConfig: !!error.config,
        hasResponse: !!error.response,
        errorCode: error.code,
        errorMessage: error.message,
      });
    }

    const originalRequest = error.config;

    // Guard against undefined config - pass to next interceptor
    if (!originalRequest) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log('⚠️ RETRY: No config, passing to ErrorInterceptor');
      }
      return error;
    }

    const status = error.response?.status;

    // Check if this is a retryable error
    const isNetworkOr5xx = !error.response || (status ? status >= 500 : false);
    const isRetryable = isNetworkOr5xx || (status ? isRetryableStatusCode(status) : false);
    const retryCount = originalRequest.__retryCount || 0;

    // Handle throttling (429) with Retry-After header
    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
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
      if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
        this.consecutiveTimeouts++;

        // Mark as weak network if too many consecutive timeouts
        if (this.consecutiveTimeouts >= this.weakNetworkThreshold) {
          error.code = 'WEAK_NETWORK';
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
