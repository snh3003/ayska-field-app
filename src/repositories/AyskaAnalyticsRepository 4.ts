import {
  ActivityRoundup,
  EmployeeAnalytics,
  IAnalyticsRepository,
} from '../interfaces/AyskaOnboardingInterface';
import { LocalDataRepository } from './AyskaLocalDataRepository';
import { Assignment, CheckIn, Employee } from '../types/AyskaModelsType';

export class AnalyticsRepository implements IAnalyticsRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getEmployeeAnalytics(employeeId: string): Promise<EmployeeAnalytics> {
    const assignments = (await this.dataRepository.getAll(
      'assignments'
    )) as Assignment[];
    const checkIns = (await this.dataRepository.getAll(
      'checkIns'
    )) as CheckIn[];

    const employeeAssignments = assignments.filter(
      a => a.employeeId === employeeId
    );
    const employeeCheckIns = checkIns.filter(c => c.employeeId === employeeId);

    const totalAssignments = employeeAssignments.length;
    const completedAssignments = employeeAssignments.filter(
      a => a.status === 'completed'
    ).length;
    const totalCheckIns = employeeCheckIns.length;

    // Calculate average check-ins per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCheckIns = employeeCheckIns.filter(
      c => new Date(c.timestamp) >= thirtyDaysAgo
    );
    const averageCheckInsPerDay = recentCheckIns.length / 30;

    const lastCheckIn =
      employeeCheckIns.length > 0
        ? employeeCheckIns.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )[0]?.timestamp || null
        : null;

    const totalTarget = employeeAssignments.reduce(
      (sum, a) => sum + a.target,
      0
    );
    const targetAchievementRate =
      totalTarget > 0 ? (totalCheckIns / totalTarget) * 100 : 0;

    return {
      employeeId,
      totalAssignments,
      completedAssignments,
      totalCheckIns,
      averageCheckInsPerDay,
      lastCheckIn,
      targetAchievementRate,
    };
  }

  async getAllEmployeesAnalytics(): Promise<EmployeeAnalytics[]> {
    const employees = (await this.dataRepository.getAll(
      'employees'
    )) as Employee[];
    const analytics: EmployeeAnalytics[] = [];

    for (const employee of employees) {
      const analyticsData = await this.getEmployeeAnalytics(employee.id);
      analytics.push(analyticsData);
    }

    return analytics;
  }

  async generateActivityRoundup(
    period: 'daily' | 'weekly'
  ): Promise<ActivityRoundup> {
    const startDate = new Date();
    const endDate = new Date();

    if (period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    const employees = (await this.dataRepository.getAll(
      'employees'
    )) as Employee[];
    const assignments = (await this.dataRepository.getAll(
      'assignments'
    )) as Assignment[];
    const checkIns = (await this.dataRepository.getAll(
      'checkIns'
    )) as CheckIn[];

    const employeeSummaries = employees.map(employee => {
      const employeeAssignments = assignments.filter(
        a => a.employeeId === employee.id
      );
      const employeeCheckIns = checkIns.filter(
        c =>
          c.employeeId === employee.id &&
          new Date(c.timestamp) >= startDate &&
          new Date(c.timestamp) <= endDate
      );

      const targetsAchieved = employeeAssignments.filter(
        a => a.currentProgress >= a.target
      ).length;

      const doctorsVisited = [
        ...new Set(employeeCheckIns.map(c => c.doctorId)),
      ];

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        checkInsCount: employeeCheckIns.length,
        targetsAchieved,
        doctorsVisited,
      };
    });

    return {
      id: Math.random().toString(36).substr(2, 9),
      adminId: 'a1', // Default admin ID
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      generatedAt: new Date().toISOString(),
      employeeSummaries,
    };
  }
}
