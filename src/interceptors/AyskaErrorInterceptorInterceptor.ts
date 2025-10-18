import { AxiosError } from 'axios';
import { IHttpInterceptor } from '../interfaces/AyskaServicesInterface';

export class ErrorInterceptor implements IHttpInterceptor {
  private onUnauthorized: () => void;

  constructor(onUnauthorized: () => void) {
    this.onUnauthorized = onUnauthorized;
  }

  onError(error: AxiosError): any {
    const status = error.response?.status;

    if (status === 401) {
      this.onUnauthorized();
    }

    return Promise.reject(error);
  }
}
