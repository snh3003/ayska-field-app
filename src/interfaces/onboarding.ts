// Onboarding and assignment interfaces following Interface Segregation Principle

import { IDataRepository } from './repositories';
import {
  ActivityRoundup,
  Assignment,
  CheckIn,
  Doctor,
  Employee,
  EmployeeAnalytics,
  Location,
} from '../types/models';

// Re-export types for repositories
export type {
  ActivityRoundup,
  Assignment,
  CheckIn,
  Doctor,
  Employee,
  EmployeeAnalytics,
};

export interface IEmailService {
  sendWelcomeEmail(
    _to: string,
    _name: string,
    _tempPassword: string
  ): Promise<boolean>;
  sendAssignmentEmail(_to: string, _assignments: any[]): Promise<boolean>;
}

export interface IEmployeeRepository extends IDataRepository<Employee> {
  getByEmail(_email: string): Promise<Employee | null>;
  updatePassword(_id: string, _password: string): Promise<boolean>;
  markFirstLoginComplete(_id: string): Promise<boolean>;
}

export interface IDoctorRepository extends IDataRepository<Doctor> {
  getByLocation(
    _lat: number,
    _lng: number,
    _radiusKm: number
  ): Promise<Doctor[]>;
}

export interface IAssignmentRepository extends IDataRepository<Assignment> {
  getByEmployee(_employeeId: string): Promise<Assignment[]>;
  getByDoctor(_doctorId: string): Promise<Assignment[]>;
  updateProgress(_id: string, _progress: number): Promise<Assignment | null>;
}

export interface ICheckInRepository extends IDataRepository<CheckIn> {
  getByEmployee(
    _employeeId: string,
    _startDate?: string,
    _endDate?: string
  ): Promise<CheckIn[]>;
  getByDoctor(_doctorId: string): Promise<CheckIn[]>;
}

export interface IAnalyticsRepository {
  getEmployeeAnalytics(_employeeId: string): Promise<EmployeeAnalytics>;
  getAllEmployeesAnalytics(): Promise<EmployeeAnalytics[]>;
  generateActivityRoundup(
    _period: 'daily' | 'weekly'
  ): Promise<ActivityRoundup>;
}

export interface IGeolocationService {
  getCurrentLocation(): Promise<Location>;
  calculateDistance(_loc1: Location, _loc2: Location): number;
}

export interface IMapProvider {
  type: 'google' | 'mappls';
  getLocationFromAddress(_address: string): Promise<Location | null>;
  getAddressFromLocation(_location: Location): Promise<string | null>;
}

export interface IAnalyticsService {
  getEmployeeAnalytics(_employeeId: string): Promise<EmployeeAnalytics>;
  getAllEmployeesAnalytics(): Promise<EmployeeAnalytics[]>;
  generateActivityRoundup(
    _period: 'daily' | 'weekly'
  ): Promise<ActivityRoundup>;
}

export interface IAssignmentService {
  assignDoctorsToEmployee(
    _employeeId: string,
    _doctorIds: string[],
    _targets: number[],
    _adminId: string
  ): Promise<Assignment[]>;
  updateEmployeeTarget(
    _assignmentId: string,
    _newTarget: number
  ): Promise<Assignment>;
  getEmployeeAssignments(_employeeId: string): Promise<Assignment[]>;
}

export interface ICheckInService {
  performCheckIn(
    _employeeId: string,
    _doctorId: string,
    _employeeLocation: { lat: number; lng: number },
    _notes?: string
  ): Promise<CheckIn>;
}

export interface IOnboardingService {
  onboardEmployee(
    _name: string,
    _email: string,
    _age: number,
    _dateOfBirth: string,
    _areaOfOperation: string,
    _adminId: string
  ): Promise<Employee>;
  onboardDoctor(
    _name: string,
    _age: number,
    _dateOfBirth: string,
    _specialization: string,
    _location: { lat: number; lng: number },
    _phone: string,
    _adminId: string
  ): Promise<Doctor>;
}
