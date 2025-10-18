import { AsyncStorageProvider } from '../providers/AyskaAsyncStorageProviderProvider';
import { AuthStorageService } from '../services/AyskaAuthStorageServiceService';
import { CacheStorageService } from '../services/AyskaCacheStorageServiceService';
import { DraftStorageService } from '../services/AyskaDraftStorageServiceService';
import { SettingsStorageService } from '../services/AyskaSettingsStorageServiceService';
import { LocalDataRepository } from '../repositories/AyskaLocalDataRepositoryRepository';
import { AuthRepository } from '../repositories/AyskaAuthRepositoryRepository';
import { StatsRepository } from '../repositories/AyskaStatsRepositoryRepository';
import { NotificationsRepository } from '../repositories/AyskaNotificationsRepositoryRepository';
import { EmployeeRepository } from '../repositories/AyskaEmployeeRepositoryRepository';
import { DoctorRepository } from '../repositories/AyskaDoctorRepositoryRepository';
import { AssignmentRepository } from '../repositories/AyskaAssignmentRepositoryRepository';
import { CheckInRepository } from '../repositories/AyskaCheckInRepositoryRepository';
import { AnalyticsRepository } from '../repositories/AyskaAnalyticsRepositoryRepository';
import { HttpClient } from '../api/HttpClient';
import { AuthInterceptor } from '../interceptors/AyskaAuthInterceptorInterceptor';
import { RetryInterceptor } from '../interceptors/AyskaRetryInterceptorInterceptor';
import { ErrorInterceptor } from '../interceptors/AyskaErrorInterceptorInterceptor';
import { AdminService } from '../services/AyskaAdminServiceService';
import { EmployeeService } from '../services/AyskaEmployeeServiceService';
import { ReportService } from '../services/AyskaReportServiceService';
import { NotificationsService } from '../services/AyskaNotificationsServiceService';
import { EmailService } from '../services/AyskaEmailServiceService';
import { OnboardingService } from '../services/AyskaOnboardingServiceService';
import { AssignmentService } from '../services/AyskaAssignmentServiceService';
import { CheckInService } from '../services/AyskaCheckInServiceService';
import { AnalyticsService } from '../services/AyskaAnalyticsServiceService';
import { GeolocationService } from '../services/AyskaGeolocationServiceService';
import {
  AdminDashboardObserver,
  EmployeeFeedObserver,
  NotificationObserverService,
  PushNotificationObserver,
} from '../services/AyskaNotificationObserverService';
import { ProximityValidator } from '../validation/strategies/AyskaLocationValidatorValidation';
import { GoogleMapProvider } from '../providers/AyskaGoogleMapProviderProvider';
import { MapplsMapProvider } from '../providers/AyskaMapplsMapProviderProvider';
import { MapsConfig } from '../config/maps';

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

    // Pattern implementations
    this.registerSingleton('INotificationSubject', () => {
      const subject = new NotificationObserverService();
      subject.attach(new AdminDashboardObserver());
      subject.attach(new EmployeeFeedObserver());
      subject.attach(new PushNotificationObserver());
      return subject;
    });
    this.registerSingleton(
      'ILocationValidator',
      () => new ProximityValidator()
    );

    // New services
    this.registerSingleton('IEmailService', () => new EmailService());
    this.registerSingleton(
      'IGeolocationService',
      () => new GeolocationService()
    );
    this.registerFactory(
      'IOnboardingService',
      () =>
        new OnboardingService(
          this.get('IEmployeeRepository'),
          this.get('IDoctorRepository'),
          this.get('IEmailService'),
          this.get('INotificationSubject')
        )
    );
    this.registerFactory(
      'IAssignmentService',
      () =>
        new AssignmentService(
          this.get('IAssignmentRepository'),
          this.get('INotificationSubject')
        )
    );
    this.registerFactory(
      'ICheckInService',
      () =>
        new CheckInService(
          this.get('ICheckInRepository'),
          this.get('IDoctorRepository'),
          this.get('IAssignmentRepository'),
          this.get('ILocationValidator'),
          this.get('INotificationSubject'),
          this.get('IGeolocationService')
        )
    );
    this.registerFactory(
      'IAnalyticsService',
      () => new AnalyticsService(this.get('IAnalyticsRepository'))
    );
    this.registerFactory('IMapProvider', () => {
      return MapsConfig.provider === 'google'
        ? new GoogleMapProvider()
        : new MapplsMapProvider();
    });

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
    this.registerSingleton(
      'IEmployeeRepository',
      () => new EmployeeRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'IDoctorRepository',
      () => new DoctorRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'IAssignmentRepository',
      () => new AssignmentRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'ICheckInRepository',
      () => new CheckInRepository(this.get('IDataRepository'))
    );
    this.registerSingleton(
      'IAnalyticsRepository',
      () => new AnalyticsRepository(this.get('IDataRepository'))
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
