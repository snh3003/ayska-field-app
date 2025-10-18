import data from '../fixtures/data.json';
import {
  ActivityRoundup,
  Admin,
  Assignment,
  Attendance,
  CheckIn,
  Doctor,
  Employee,
  Notification,
  Visit,
} from '../types';

export interface Database {
  admins: Admin[];
  employees: Employee[];
  doctors: Doctor[];
  assignments: Assignment[];
  attendance: Attendance[];
  visits: Visit[];
  notifications: Notification[];
  checkIns: CheckIn[];
  roundups: ActivityRoundup[];
}

class LocalDataService {
  private data: Database = data as Database;

  getAll<T>(collectionName: keyof Database): T[] {
    return this.data[collectionName] as T[];
  }

  getById<T>(collectionName: keyof Database, id: string): T | null {
    const collection = this.data[collectionName] as T[];
    return collection.find((item: any) => item.id === id) || null;
  }

  add<T>(collectionName: keyof Database, item: T): T {
    const collection = this.data[collectionName] as T[];
    collection.push(item);
    return item;
  }

  update<T>(
    collectionName: keyof Database,
    id: string,
    updates: Partial<T>
  ): T | null {
    const collection = this.data[collectionName] as T[];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates } as T;
      return collection[index] || null;
    }
    return null;
  }

  delete(collectionName: keyof Database, id: string): boolean {
    const collection = this.data[collectionName] as any[];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      collection.splice(index, 1);
      return true;
    }
    return false;
  }

  // Auth helpers
  validateAdmin(email: string, password: string): Admin | null {
    return (
      this.data.admins.find(
        admin => admin.email === email && admin.password === password
      ) || null
    );
  }

  validateEmployee(email: string, password: string): Employee | null {
    return (
      this.data.employees.find(
        emp => emp.email === email && emp.password === password
      ) || null
    );
  }

  // Business logic helpers
  getAssignedDoctors(employeeId: string): Doctor[] {
    const assignments = this.data.assignments.filter(
      a => a.employeeId === employeeId && a.status === 'active'
    );
    return assignments
      .map(a => this.getById<Doctor>('doctors', a.doctorId))
      .filter(Boolean) as Doctor[];
  }

  getEmployeeStats(employeeId: string) {
    const attendance = this.data.attendance.filter(
      a => a.employeeId === employeeId
    );
    const visits = this.data.visits.filter(v => v.employeeId === employeeId);
    return {
      totalDays: attendance.length,
      completedDays: attendance.filter(a => a.status === 'completed').length,
      totalVisits: visits.length,
      completedVisits: visits.filter(v => v.status === 'completed').length,
    };
  }

  getAdminStats() {
    return {
      totalEmployees: this.data.employees.length,
      totalDoctors: this.data.doctors.length,
      totalVisits: this.data.visits.length,
      activeAttendance: this.data.attendance.filter(a => a.status === 'active')
        .length,
    };
  }
}

export const localDataService = new LocalDataService();
