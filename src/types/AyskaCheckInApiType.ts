// Check-in API Types - Complete type definitions for check-in system
// Covers all check-in related API endpoints and responses

// Check-in model
export interface Checkin {
  id: string;
  employee_id: string;
  doctor_id: string;
  latitude: number;
  longitude: number;
  is_valid: boolean;
  distance_meters: number;
  max_radius_meters: number;
  notes?: string;
  checkin_time: string;
  doctor_name?: string;
  doctor_specialization?: string;
  assignment_id?: string;
  assignment_progress?: number;
  assignment_target?: number;
}

// Check-in request payload
export interface CheckinRequest {
  doctor_id: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

// Check-in response
export interface CheckinResponse {
  message: string;
  checkin_id: string;
  is_valid: boolean;
  distance_meters: number;
  assignment_progress: number;
  assignment_completed: boolean;
}

// Check-in history response with pagination
export interface CheckinHistoryResponse {
  checkins: Checkin[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  valid_checkins: number;
  invalid_checkins: number;
  total_doctors_visited: number;
}

// Check-in query parameters
export interface CheckinQueryParams {
  page?: number;
  size?: number;
  doctor_id?: string;
  is_valid?: boolean;
}

// Employee profile response (for check-in context)
export interface EmployeeProfileResponse {
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active_assignments: number;
  completed_assignments: number;
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  success_rate: number;
  average_distance: number;
  most_visited_doctor: string;
  most_visited_specialization: string;
}

// Check-in service interface
export interface ICheckInService {
  submitCheckIn(_data: CheckinRequest): Promise<CheckinResponse>;
  getCheckInHistory(
    _params?: CheckinQueryParams
  ): Promise<CheckinHistoryResponse>;
  getDoctorForCheckIn(_id: string): Promise<any>; // Doctor details for check-in
  getEmployeeProfile(): Promise<EmployeeProfileResponse>;
}
