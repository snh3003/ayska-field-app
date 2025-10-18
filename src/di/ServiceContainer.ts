import { AsyncStorageProvider } from '../providers/AsyncStorageProvider';
import { AuthStorageService } from '../services/AuthStorageService';
import { CacheStorageService } from '../services/CacheStorageService';
import { DraftStorageService } from '../services/DraftStorageService';
import { SettingsStorageService } from '../services/SettingsStorageService';
import { LocalDataRepository } from '../repositories/LocalDataRepository';
import { AuthRepository } from '../repositories/AuthRepository';
import { StatsRepository } from '../repositories/StatsRepository';
import { NotificationsRepository } from '../repositories/NotificationsRepository';
import { HttpClient } from '../api/HttpClient';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';
import { RetryInterceptor } from '../interceptors/RetryInterceptor';
import { ErrorInterceptor } from '../interceptors/ErrorInterceptor';
import { AdminService } from '../services/AdminService';
import { EmployeeService } from '../services/EmployeeService';
import { ReportService } from '../services/ReportService';
import { NotificationsService } from '../services/NotificationsService';

export class ServiceContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  constructor() {
    this.registerServices();
  }

  private registerServices(): void {
    // Storage providers
    this.registerSingleton(
      'IStorageProvider',
      () => new AsyncStorageProvider()
    );

    // Storage services
    this.registerSingleton(
      'IAuthStorage',
      () => new AuthStorageService(this.get('IStorageProvider'))
    );
    this.registerSingleton(
      'ICacheStorage',
      () => new CacheStorageService(this.get('IStorageProvider'))
    );
    this.registerSingleton(
      'IDraftStorage',
      () => new DraftStorageService(this.get('IStorageProvider'))
    );
    this.registerSingleton(
      'ISettingsStorage',
      () => new SettingsStorageService(this.get('IStorageProvider'))
    );
    this.registerSingleton(
      'INotificationsService',
      () => new NotificationsService(this.get('INotificationsRepository'))
    );

    // Data repositories
    this.registerSingleton('IDataRepository', () => new LocalDataRepository());
    this.registerSingleton(
      'IAuthRepository',
      () => new AuthRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'IStatsRepository',
      () => new StatsRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'INotificationsRepository',
      () => new NotificationsRepository(this.get('IDataRepository'))
    );

    // HTTP client and interceptors
    this.registerFactory('IHttpClient', () => {
      const httpClient = new HttpClient('', 15000);

      // Add interceptors
      httpClient.addInterceptor(
        new AuthInterceptor(() => {
          // This should be injected from Redux store
          return null; // TODO: Get from store
        })
      );
      httpClient.addInterceptor(new RetryInterceptor(1));
      httpClient.addInterceptor(
        new ErrorInterceptor(() => {
          // This should dispatch logout action
          // TODO: Implement proper logout dispatch
        })
      );

      return httpClient;
    });

    // Business services
    this.registerFactory(
      'IAdminService',
      () => new AdminService((this.get('IHttpClient') as any).axios)
    );
    this.registerFactory(
      'IEmployeeService',
      () => new EmployeeService((this.get('IHttpClient') as any).axios)
    );
    this.registerFactory(
      'IReportService',
      () => new ReportService((this.get('IHttpClient') as any).axios)
    );
  }

  registerSingleton<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  registerFactory<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  get<T>(token: string): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service ${token} not registered`);
    }

    const service = factory();
    this.services.set(token, service);
    return service;
  }

  // Method to update HTTP client with store dependencies
  updateHttpClientDependencies(
    getToken: () => string | null,
    onUnauthorized: () => void
  ): void {
    const httpClient = new HttpClient('', 15000);

    httpClient.addInterceptor(new AuthInterceptor(getToken));
    httpClient.addInterceptor(new RetryInterceptor(1));
    httpClient.addInterceptor(new ErrorInterceptor(onUnauthorized));

    this.services.set('IHttpClient', httpClient);
  }
}
