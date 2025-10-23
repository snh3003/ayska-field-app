import { AxiosRequestConfig } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
// ServiceContainer imported lazily to avoid circular dependencies

export class AuthInterceptor implements IHttpInterceptor {
  private getToken: () => string | null;
  private authStorage: any;

  constructor(getToken: () => string | null) {
    this.getToken = getToken;
    // Get auth storage service for token management - lazy import to avoid circular dependencies
    this.authStorage = null; // Will be initialized when needed
  }

  onRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const token = this.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  /**
   * Enhanced request interceptor with token refresh logic
   */
  async onRequestAsync(
    config: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    let token = this.getToken();

    // Initialize authStorage lazily to avoid circular dependencies
    if (!this.authStorage) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { ServiceContainer } = require('../di/ServiceContainer');
      this.authStorage = ServiceContainer.getInstance().get('IAuthStorage');
    }

    // Check if token is expired and refresh if needed
    if (token && this.authStorage) {
      const isExpired = await this.authStorage.isTokenExpired();
      if (isExpired) {
        try {
          // Try to refresh token
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { ServiceContainer } = require('../di/ServiceContainer');
          const authService = ServiceContainer.getInstance().get(
            'IAuthService'
          ) as any;
          const newToken = await authService.refreshToken();
          if (newToken) {
            await this.authStorage.setToken(newToken);
            token = newToken;
          }
        } catch {
          // Refresh failed, clear auth data
          await this.authStorage.clearAll();
          token = null;
        }
      }
    }

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
}
