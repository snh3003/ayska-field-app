import {
  IAnalyticsRepository,
  IAnalyticsService,
} from '../interfaces/AyskaOnboardingInterface';
import { ActivityRoundup, EmployeeAnalytics } from '../types/AyskaModelsType';

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
