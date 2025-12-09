import { AsyncStorageProvider } from '../providers/AyskaAsyncStorageProvider';
import { AuthStorageService } from '../services/AyskaAuthStorageService';
import { CacheStorageService } from '../services/AyskaCacheStorageService';
import { DraftStorageService } from '../services/AyskaDraftStorageService';
import { SettingsStorageService } from '../services/AyskaSettingsStorageService';
import { LocalDataRepository } from '../repositories/AyskaLocalDataRepository';
// AuthRepository removed - backend handles OTP validation
import { StatsRepository } from '../repositories/AyskaStatsRepository';
import { NotificationsRepository } from '../repositories/AyskaNotificationsRepository';
import { EmployeeRepository } from '../repositories/AyskaEmployeeRepository';
import { DoctorRepository } from '../repositories/AyskaDoctorRepository';
import { AssignmentRepository } from '../repositories/AyskaAssignmentRepository';
import { CheckInRepository } from '../repositories/AyskaCheckInRepository';
import { AnalyticsRepository } from '../repositories/AyskaAnalyticsRepository';
import { HttpClient } from '../api/HttpClient';
// Interceptors imported lazily to avoid circular dependencies
import { AdminService } from '../services/AyskaAdminService';
// EmployeeService import removed - using new EmployeeService
import { ReportService } from '../services/AyskaReportService';
import { NotificationsService } from '../services/AyskaNotificationsService';
// EmailService removed - backend handles email sending
import { OnboardingService } from '../services/AyskaOnboardingService';
import { AssignmentService } from '../services/AyskaAssignmentService';
import { CheckInService } from '../services/AyskaCheckInService';
import { AnalyticsService } from '../services/AyskaAnalyticsService';
import { GeolocationService } from '../services/AyskaGeolocationService';
import { AuthService } from '../services/AyskaAuthService';
import { EmployeeService } from '../services/AyskaEmployeeService';
import { ProfileService } from '../services/AyskaProfileService';
import {
  AdminDashboardObserver,
  EmployeeFeedObserver,
  NotificationObserverService,
  PushNotificationObserver,
} from '../services/AyskaNotificationObserverService';
import { ProximityValidator } from '../validation/strategies/AyskaLocationValidatorValidation';
import { GoogleMapProvider } from '../providers/AyskaGoogleMapProvider';
import { MapplsMapProvider } from '../providers/AyskaMapplsMapProvider';
import { MapsConfig } from '../config/maps';

export class ServiceContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();
  private static instance: ServiceContainer;

  constructor() {
    this.registerServices();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private registerServices(): void {
    // Storage providers
    this.registerSingleton('IStorageProvider', () => new AsyncStorageProvider());

    // Storage services
    this.registerSingleton(
      'IAuthStorage',
      () => new AuthStorageService(this.get('IStorageProvider')),
    );
    this.registerSingleton(
      'ICacheStorage',
      () => new CacheStorageService(this.get('IStorageProvider')),
    );
    this.registerSingleton(
      'IDraftStorage',
      () => new DraftStorageService(this.get('IStorageProvider')),
    );
    this.registerSingleton(
      'ISettingsStorage',
      () => new SettingsStorageService(this.get('IStorageProvider')),
    );
    this.registerFactory(
      'INotificationService',
      () => new NotificationsService(this.get('IHttpClient')),
    );

    // Pattern implementations
    this.registerSingleton('INotificationSubject', () => {
      const subject = new NotificationObserverService();
      subject.attach(new AdminDashboardObserver());
      subject.attach(new EmployeeFeedObserver());
      subject.attach(new PushNotificationObserver());
      return subject;
    });
    this.registerSingleton('ILocationValidator', () => new ProximityValidator());

    // New services
    // IEmailService removed - backend handles email sending
    this.registerSingleton('IGeolocationService', () => new GeolocationService());

    // API Services
    this.registerFactory('IAuthService', () => new AuthService(this.get('IHttpClient')));
    this.registerFactory('IEmployeeService', () => new EmployeeService(this.get('IHttpClient')));
    this.registerFactory('IProfileService', () => new ProfileService(this.get('IHttpClient')));
    this.registerFactory(
      'IOnboardingService',
      () =>
        new OnboardingService(
          this.get('IEmployeeRepository'),
          this.get('IDoctorRepository'),
          this.get('INotificationSubject'),
        ),
    );
    this.registerFactory(
      'IAssignmentService',
      () => new AssignmentService(this.get('IHttpClient')),
    );
    this.registerFactory('ICheckInService', () => new CheckInService(this.get('IHttpClient')));
    this.registerFactory(
      'IAnalyticsService',
      () => new AnalyticsService(this.get('IAnalyticsRepository')),
    );
    this.registerFactory('IMapProvider', () => {
      return MapsConfig.provider === 'google' ? new GoogleMapProvider() : new MapplsMapProvider();
    });

    // Data repositories
    this.registerSingleton('IDataRepository', () => new LocalDataRepository());
    // IAuthRepository removed - backend handles OTP validation
    this.registerSingleton(
      'IStatsRepository',
      () => new StatsRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'INotificationsRepository',
      () => new NotificationsRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'IEmployeeRepository',
      () => new EmployeeRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'IDoctorRepository',
      () => new DoctorRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'IAssignmentRepository',
      () => new AssignmentRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'ICheckInRepository',
      () => new CheckInRepository(this.get('IDataRepository')),
    );
    this.registerSingleton(
      'IAnalyticsRepository',
      () => new AnalyticsRepository(this.get('IDataRepository')),
    );

    // HTTP client and interceptors
    this.registerFactory('IHttpClient', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { API_CONFIG } = require('../config/api');
      const httpClient = new HttpClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);

      // Add interceptors - lazy import to avoid circular dependencies

      const AuthInterceptor = require('../interceptors/AyskaAuthInterceptor').AuthInterceptor;

      const RetryInterceptor = require('../interceptors/AyskaRetryInterceptor').RetryInterceptor;

      const ErrorInterceptor = require('../interceptors/AyskaErrorInterceptor').ErrorInterceptor;

      httpClient.addInterceptor(
        new AuthInterceptor(() => {
          // Get token from Redux store
          try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { store } = require('../store');
            return store.getState().auth?.token || null;
          } catch {
            return null;
          }
        }),
      );
      httpClient.addInterceptor(new RetryInterceptor(3));
      httpClient.addInterceptor(
        new ErrorInterceptor(
          () => {
            // Dispatch logout action on 401
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { store } = require('../store');
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const { logout } = require('../store/slices/AyskaAuthSlice');
              store.dispatch(logout());
            } catch (error) {
              if (__DEV__) {
                console.error('Failed to dispatch logout:', error);
              }
            }
          },
          (apiError: { code: number; message: string; title: string }) => {
            // Show toast for non-401 errors
            if (apiError.code !== 401) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const { globalToast } = require('../utils/AyskaGlobalToastUtil');
                globalToast.error(apiError.message);
              } catch (error) {
                if (__DEV__) {
                  console.error('Failed to show error toast:', error);
                }
              }
            }
          },
        ),
      );

      return httpClient;
    });

    // Register new API services with lazy loading for DoctorService
    this.registerFactory('IDoctorService', () => {
      const httpClient = this.get('IHttpClient') as any;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { DoctorService } = require('../services/AyskaDoctorService');
      return new DoctorService(httpClient);
    });

    // Business services (old services expecting AxiosInstance)
    this.registerFactory(
      'IAdminService',
      () => new AdminService((this.get('IHttpClient') as any).axios),
    );
    this.registerFactory(
      'IReportService',
      () => new ReportService((this.get('IHttpClient') as any).axios),
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
  updateHttpClientDependencies(getToken: () => string | null, onUnauthorized: () => void): void {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { API_CONFIG } = require('../config/api');
    const httpClient = new HttpClient(API_CONFIG.BASE_URL, API_CONFIG.TIMEOUT);

    // Lazy import to avoid circular dependencies

    const AuthInterceptor = require('../interceptors/AyskaAuthInterceptor').AuthInterceptor;

    const RetryInterceptor = require('../interceptors/AyskaRetryInterceptor').RetryInterceptor;

    const ErrorInterceptor = require('../interceptors/AyskaErrorInterceptor').ErrorInterceptor;

    httpClient.addInterceptor(new AuthInterceptor(getToken));
    httpClient.addInterceptor(new RetryInterceptor(3));
    httpClient.addInterceptor(new ErrorInterceptor(onUnauthorized));

    this.services.set('IHttpClient', httpClient);
  }
}
