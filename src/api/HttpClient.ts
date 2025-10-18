import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  IHttpClient,
  IHttpInterceptor,
} from '../interfaces/AyskaServicesInterface';

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
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onRequest ? interceptor.onRequest(acc) : acc;
        }, config);
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      response => {
        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onResponse ? interceptor.onResponse(acc) : acc;
        }, response);
      },
      error => {
        return this.interceptors.reduce((acc, interceptor) => {
          return interceptor.onError
            ? interceptor.onError(acc)
            : Promise.reject(acc);
        }, error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(
      url,
      data,
      config
    );
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
