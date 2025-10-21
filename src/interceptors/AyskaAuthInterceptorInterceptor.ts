import { AxiosRequestConfig } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';
import { ServiceContainer } from '../di/ServiceContainer';

export class AuthInterceptor implements IHttpInterceptor {
  private getToken: () => string | null;
  private authStorage: any;

  constructor(getToken: () => string | null) {
    this.getToken = getToken;
    // Get auth storage service for token management
    this.authStorage = ServiceContainer.getInstance().get('IAuthStorage');
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

    // Check if token is expired and refresh if needed
    if (token && this.authStorage) {
      const isExpired = await this.authStorage.isTokenExpired();
      if (isExpired) {
        try {
          // Try to refresh token
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
