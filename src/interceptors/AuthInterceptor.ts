import { AxiosRequestConfig } from 'axios';
import { IHttpInterceptor } from '../interfaces/services';

export class AuthInterceptor implements IHttpInterceptor {
  private getToken: () => string | null;

  constructor(getToken: () => string | null) {
    this.getToken = getToken;
  }

  onRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const token = this.getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
}
