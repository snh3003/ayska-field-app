import {
  IAnalyticsRepository,
  IAnalyticsService,
} from '../interfaces/onboarding';
import { ActivityRoundup, EmployeeAnalytics } from '../types/models';

export class AnalyticsService implements IAnalyticsService {
  constructor(private _analyticsRepo: IAnalyticsRepository) {}

  async getEmployeeAnalytics(_employeeId: string): Promise<EmployeeAnalytics> {
    return this._analyticsRepo.getEmployeeAnalytics(_employeeId);
  }

  async getAllEmployeesAnalytics(): Promise<EmployeeAnalytics[]> {
    return this._analyticsRepo.getAllEmployeesAnalytics();
  }

  async generateActivityRoundup(
    _period: 'daily' | 'weekly'
  ): Promise<ActivityRoundup> {
    return this._analyticsRepo.generateActivityRoundup(_period);
  }
}

// Interface already defined in interfaces/onboarding.ts
