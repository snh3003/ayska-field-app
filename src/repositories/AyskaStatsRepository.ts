import {
  AdminStats,
  Doctor,
  EmployeeStats,
  IStatsRepository,
} from '../interfaces/AyskaRepositoriesInterface';
import { LocalDataRepository } from './AyskaLocalDataRepository';

export class StatsRepository implements IStatsRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getEmployeeStats(employeeId: string): Promise<EmployeeStats> {
    const attendance = await this.dataRepository.getAll('attendance');
    const visits = await this.dataRepository.getAll('visits');

    const employeeAttendance = attendance.filter(
      (a: any) => a.employeeId === employeeId
    );
    const employeeVisits = visits.filter(
      (v: any) => v.employeeId === employeeId
    );

    return {
      totalDays: employeeAttendance.length,
      completedDays: employeeAttendance.filter(
        (a: any) => a.status === 'completed'
      ).length,
      totalVisits: employeeVisits.length,
      completedVisits: employeeVisits.filter(
        (v: any) => v.status === 'completed'
      ).length,
    };
  }

  async getAdminStats(): Promise<AdminStats> {
    const employees = await this.dataRepository.getAll('employees');
    const doctors = await this.dataRepository.getAll('doctors');
    const visits = await this.dataRepository.getAll('visits');
    const attendance = await this.dataRepository.getAll('attendance');

    return {
      totalEmployees: employees.length,
      totalDoctors: doctors.length,
      totalVisits: visits.length,
      activeAttendance: attendance.filter((a: any) => a.status === 'active')
        .length,
    };
  }

  async getAssignedDoctors(employeeId: string): Promise<Doctor[]> {
    const assignments = await this.dataRepository.getAll('assignments');
    const doctors = await this.dataRepository.getAll('doctors');

    const activeAssignments = assignments.filter(
      (a: any) => a.employeeId === employeeId && a.status === 'active'
    );

    return activeAssignments
      .map((a: any) => doctors.find((d: Doctor) => d.id === a.doctorId))
      .filter(Boolean) as Doctor[];
  }
}
