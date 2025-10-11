import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/services';

export class RetryInterceptor implements IHttpInterceptor {
  private maxRetries: number;

  constructor(maxRetries: number = 1) {
    this.maxRetries = maxRetries;
  }

  onError(error: AxiosError & { config: any }): any {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isNetworkOr5xx = !error.response || (status ? status >= 500 : false);

    if (
      isNetworkOr5xx &&
      !originalRequest.__isRetry &&
      originalRequest.__retryCount < this.maxRetries
    ) {
      originalRequest.__isRetry = true;
      originalRequest.__retryCount = (originalRequest.__retryCount || 0) + 1;
      return originalRequest;
    }

    return Promise.reject(error);
  }
}
