// Analytics Service - Complete API integration for analytics and reporting
// Implements all 11 analytics endpoints with comprehensive error handling

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  AssignmentAnalyticsResponse,
  CheckinAnalyticsResponse,
  DashboardResponse,
  EmployeePerformance,
  EmployeePerformanceResponse,
  IAnalyticsService,
  KPIsResponse,
  ReportGenerateRequest,
  ReportGenerateResponse,
  SystemHealthResponse,
  TrendResponse,
} from '../types/AyskaAnalyticsApiType';

export class AnalyticsService implements IAnalyticsService {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Get dashboard overview metrics
   */
  async getDashboard(): Promise<DashboardResponse> {
    try {
      const response = await this.httpClient.get<DashboardResponse>(
        '/analytics/dashboard'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get Key Performance Indicators
   */
  async getKPIs(): Promise<KPIsResponse> {
    try {
      const response =
        await this.httpClient.get<KPIsResponse>('/analytics/kpis');
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get all employees performance
   */
  async getEmployeePerformance(): Promise<EmployeePerformanceResponse> {
    try {
      const response = await this.httpClient.get<EmployeePerformanceResponse>(
        '/analytics/employees/performance'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get individual employee performance
   */
  async getIndividualPerformance(id: string): Promise<EmployeePerformance> {
    try {
      const response = await this.httpClient.get<EmployeePerformance>(
        `/analytics/employees/${id}/performance`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get assignment analytics
   */
  async getAssignmentAnalytics(): Promise<AssignmentAnalyticsResponse> {
    try {
      const response = await this.httpClient.get<AssignmentAnalyticsResponse>(
        '/analytics/assignments'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get check-in analytics
   */
  async getCheckinAnalytics(): Promise<CheckinAnalyticsResponse> {
    try {
      const response = await this.httpClient.get<CheckinAnalyticsResponse>(
        '/analytics/checkins'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get daily trend data
   */
  async getDailyTrends(days: number = 7): Promise<TrendResponse> {
    try {
      const response = await this.httpClient.get<TrendResponse>(
        `/analytics/trends/daily?days=${days}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get weekly trend data
   */
  async getWeeklyTrends(weeks: number = 4): Promise<TrendResponse> {
    try {
      const response = await this.httpClient.get<TrendResponse>(
        `/analytics/trends/weekly?weeks=${weeks}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Generate custom report
   */
  async generateReport(
    data: ReportGenerateRequest
  ): Promise<ReportGenerateResponse> {
    try {
      const response = await this.httpClient.post<ReportGenerateResponse>(
        '/analytics/reports/generate',
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Export analytics data as CSV
   */
  async exportCSV(dataType: string): Promise<Blob> {
    try {
      const response = await this.httpClient.get<Blob>(
        `/analytics/export/csv?data_type=${dataType}`,
        {
          responseType: 'blob',
        }
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealthResponse> {
    try {
      const response = await this.httpClient.get<SystemHealthResponse>(
        '/analytics/system/health'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
