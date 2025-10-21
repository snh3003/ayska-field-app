// Base HTTP Service - Common functionality for all API services
// Provides shared HTTP client configuration and error handling

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';

export abstract class HttpServiceBase {
  protected httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Handle API errors consistently across all services
   */
  protected handleError(error: any): never {
    throw ApiErrorHandler.mapError(error);
  }

  /**
   * Build query string from parameters
   */
  protected buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Get pagination parameters
   */
  protected getPaginationParams(
    page?: number,
    pageSize?: number,
    search?: string
  ) {
    return {
      page: page || 1,
      page_size: pageSize || 20,
      ...(search && { search }),
    };
  }
}
