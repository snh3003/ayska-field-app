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
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: Location;
  phone?: string;
}

export interface Assignment {
  id: string;
  employeeId: string;
  doctorId: string;
  assignedDate: string;
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
  timestamp: string;
  location: Location;
}

// Common utility types
export interface Location {
  lat: number;
  lng: number;
}

export type Status = 'active' | 'completed' | 'cancelled' | 'in_progress';
export type UserRole = 'employee' | 'admin' | null;
