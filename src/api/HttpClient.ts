import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpClient, IHttpInterceptor } from '../interfaces/AyskaServicesInterface';

export class HttpClient implements IHttpClient {
  private instance: AxiosInstance;
  private interceptors: IHttpInterceptor[] = [];

  constructor(baseURL: string, timeout: number = 15000) {
    this.instance = axios.create({
      baseURL,
      timeout,
    });
  }

  addInterceptor(interceptor: IHttpInterceptor): void {
    this.interceptors.push(interceptor);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add timing metadata
    this.instance.interceptors.request.use(
      (config) => {
        // Add request start time for duration calculation
        if (__DEV__) {
          (config as any).metadata = { startTime: Date.now() };
        }

        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onRequest ? interceptor.onRequest(acc) : acc;
        }, config);
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - log success and errors
    this.instance.interceptors.response.use(
      (response) => {
        // Enhanced success logging for debugging (solo developer)
        if (__DEV__) {
          const duration = (response.config as any).metadata?.startTime
            ? Date.now() - (response.config as any).metadata.startTime
            : 'unknown';

          // eslint-disable-next-line no-console
          console.group(
            `✅ API SUCCESS: ${response.config.method?.toUpperCase()} ${response.config.url}`,
          );
          // eslint-disable-next-line no-console
          console.log('📊 Status Code:', response.status);
          // eslint-disable-next-line no-console
          console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
          // eslint-disable-next-line no-console
          console.log('📋 Request Data:', response.config.data || 'No data');
          // eslint-disable-next-line no-console
          console.log('🔗 Full URL:', `${response.config.baseURL}${response.config.url}`);
          // eslint-disable-next-line no-console
          console.log('⏱️ Duration:', `${duration}ms`);
          // eslint-disable-next-line no-console
          console.log('⏱️ Timestamp:', new Date().toISOString());
          // eslint-disable-next-line no-console
          console.groupEnd();
        }

        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onResponse ? interceptor.onResponse(acc) : acc;
        }, response);
      },
      (error) => {
        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onError ? interceptor.onError(acc) : acc;
        }, error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  get axios(): AxiosInstance {
    return this.instance;
  }
}
