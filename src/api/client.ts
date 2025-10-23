import axios, { AxiosError, AxiosInstance } from 'axios';
import type { RootState } from '../store';
import { logout } from '../store/slices/AyskaAuthSlice';

/**
 * Axios client configured for the Field App API.
 * - Injects Bearer token from auth slice
 * - Retries once on network errors
 * - Dispatches logout on 401
 */
export class ApiClient {
  private instance: AxiosInstance;
  private getState: () => RootState;
  private dispatch: (_action: any) => void;

  constructor(options: {
    baseURL: string;
    getState: () => RootState;
    dispatch: (_action: any) => void;
  }) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: 15000,
    });
    this.getState = options.getState;
    this.dispatch = options.dispatch;

    this.instance.interceptors.request.use(config => {
      const token = this.getState().auth.token;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.instance.interceptors.response.use(
      response => response,
      async (error: AxiosError & { config: any }) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401) {
          this.dispatch(logout());
        }

        const isNetworkOr5xx =
          !error.response || (status ? status >= 500 : false);
        if (isNetworkOr5xx && !originalRequest.__isRetry) {
          originalRequest.__isRetry = true;
          return this.instance(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  get axios(): AxiosInstance {
    return this.instance;
  }
}

export type ApiError = AxiosError & { message: string };
