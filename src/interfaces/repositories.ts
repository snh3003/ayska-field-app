// Repository interfaces following Interface Segregation Principle

export interface IReadRepository<T> {
  getAll(): Promise<T[]>;
  getById(_id: string): Promise<T | null>;
}

export interface IWriteRepository<T> {
  create(_item: T): Promise<T>;
  update(_id: string, _updates: Partial<T>): Promise<T | null>;
  delete(_id: string): Promise<boolean>;
}

export interface IDataRepository<T>
  extends IReadRepository<T>,
    IWriteRepository<T> {
  // Combines read and write operations for full CRUD
}

export interface IAuthRepository {
  validateAdmin(_email: string, _password: string): Promise<Admin | null>;
  validateEmployee(_email: string, _password: string): Promise<Employee | null>;
}

export interface IStatsRepository {
  getEmployeeStats(_employeeId: string): Promise<EmployeeStats>;
  getAdminStats(): Promise<AdminStats>;
  getAssignedDoctors(_employeeId: string): Promise<Doctor[]>;
}

// Type definitions for repository interfaces
export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface Employee {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'employee';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: Location;
  phone?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface EmployeeStats {
  totalDays: number;
  completedDays: number;
  totalVisits: number;
  completedVisits: number;
}

export interface AdminStats {
  totalEmployees: number;
  totalDoctors: number;
  totalVisits: number;
  activeAttendance: number;
}

export interface INotificationsRepository {
  getNotificationsByUserId(_userId: string): Promise<Notification[]>;
  markAsRead(_notificationId: string): Promise<void>;
  markAllAsRead(_userId: string): Promise<void>;
  getUnreadCount(_userId: string): Promise<number>;
  deleteNotification(_notificationId: string): Promise<void>;
}

export interface Notification {
  id: string;
  userId: string;
  userRole: 'admin' | 'employee';
  type:
    | 'visit'
    | 'assignment'
    | 'attendance'
    | 'system'
    | 'alert'
    | 'checkin'
    | 'roundup';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionData?: {
    targetId?: string;
    route?: string;
    visitId?: string;
    employeeId?: string;
    doctorId?: string;
    attendanceId?: string;
    assignmentId?: string;
  };
}
