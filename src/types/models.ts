// Business domain models - Single source of truth for all business entities

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
  age: number;
  areaOfOperation: string;
  isFirstLogin: boolean;
  createdAt: string;
  createdBy: string; // admin ID
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: Location;
  phone?: string;
  age: number;
  createdAt: string;
  createdBy: string;
}

export interface Assignment {
  id: string;
  employeeId: string;
  doctorId: string;
  target: number; // visit count target
  currentProgress: number;
  assignedDate: string;
  assignedBy: string; // Admin ID
  status: 'active' | 'completed' | 'cancelled';
}

export interface Attendance {
  id: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
  date: string;
  status: 'active' | 'completed';
}

export interface Visit {
  id: string;
  employeeId: string;
  doctorId: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
  status: 'in_progress' | 'completed';
}

export interface CheckIn {
  id: string;
  doctorId: string;
  employeeId: string;
  assignmentId: string;
  timestamp: string;
  location: Location;
  notes?: string;
  distanceFromDoctor: number; // meters
  isValid: boolean; // within tolerance
}

// Common utility types
export interface Location {
  lat: number;
  lng: number;
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

// NEW: Analytics model
export interface EmployeeAnalytics {
  employeeId: string;
  totalAssignments: number;
  completedAssignments: number;
  totalCheckIns: number;
  averageCheckInsPerDay: number;
  lastCheckIn: string | null;
  targetAchievementRate: number;
}

// NEW: Roundup model
export interface ActivityRoundup {
  id: string;
  adminId: string;
  period: 'daily' | 'weekly';
  startDate: string;
  endDate: string;
  generatedAt: string;
  employeeSummaries: EmployeeRoundupStat[];
}

export interface EmployeeRoundupStat {
  employeeId: string;
  employeeName: string;
  checkInsCount: number;
  targetsAchieved: number;
  doctorsVisited: string[];
}

export type Status = 'active' | 'completed' | 'cancelled' | 'in_progress';
export type UserRole = 'employee' | 'admin' | null;
