// Redux store types and state interfaces

import { Notification, UserRole } from './AyskaModelsType';

// Auth State
export interface AuthState {
  token: string | null;
  role: UserRole;
  userId: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

// Admin State
export interface AdminState {
  employees: any[];
  doctors: any[];
  visits: any[];
  loading: boolean;
  error: string | null;
}

// Employee State
export interface EmployeeState {
  attendances: any[];
  visits: any[];
  assignments: any[];
  loading: boolean;
  error: string | null;
}

// Notifications State
export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

// Root State
export interface RootState {
  auth: AuthState;
  admin: AdminState;
  employee: EmployeeState;
  notifications: NotificationsState;
}

// Action types
export interface LoginCredentials {
  email: string;
  role: UserRole;
  userId: string;
  name: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Async thunk types
export interface AsyncThunkConfig {
  state: RootState;
  rejectValue: string;
}
