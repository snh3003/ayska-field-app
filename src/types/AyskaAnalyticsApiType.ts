// Analytics API Types - Complete type definitions for analytics and reporting
// Covers all 11 analytics endpoints from the API specification

// Dashboard response
export interface DashboardResponse {
  total_employees: number;
  active_employees: number;
  total_doctors: number;
  total_assignments: number;
  active_assignments: number;
  completed_assignments: number;
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  checkin_success_rate: number;
  assignment_completion_rate: number;
  average_completion_time: number;
  system_uptime: number;
}

// KPIs response
export interface KPIsResponse {
  assignment_completion_rate: number;
  checkin_success_rate: number;
  employee_productivity: number;
  system_uptime: number;
  average_response_time: number;
  data_quality_score: number;
}

// Employee performance
export interface EmployeePerformance {
  employee_id: string;
  employee_name: string;
  total_assignments: number;
  completed_assignments: number;
  completion_rate: number;
  total_checkins: number;
  valid_checkins: number;
  success_rate: number;
  average_distance: number;
  productivity_score: number;
}

// Employee performance response
export interface EmployeePerformanceResponse {
  employees: EmployeePerformance[];
  total_employees: number;
  average_completion_rate: number;
  average_success_rate: number;
  top_performer: string;
}

// Assignment analytics response
export interface AssignmentAnalyticsResponse {
  total_assignments: number;
  active_assignments: number;
  completed_assignments: number;
  cancelled_assignments: number;
  completion_rate: number;
  average_completion_time: number;
  assignments_by_status: Record<string, number>;
  assignments_by_employee: {
    employee_id: string;
    employee_name: string;
    total_assignments: number;
    completed_assignments: number;
    completion_rate: number;
  }[];
}

// Check-in analytics response
export interface CheckinAnalyticsResponse {
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  success_rate: number;
  average_distance: number;
  checkins_by_employee: {
    employee_id: string;
    employee_name: string;
    total_checkins: number;
    valid_checkins: number;
    success_rate: number;
    average_distance: number;
  }[];
  checkins_by_doctor: {
    doctor_id: string;
    doctor_name: string;
    total_checkins: number;
    valid_checkins: number;
    success_rate: number;
  }[];
}

// Trend data point
export interface TrendDataPoint {
  date: string;
  checkins: number;
  assignments: number;
  employees_active: number;
}

// Trend response
export interface TrendResponse {
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  change_percentage: number;
  data_points: TrendDataPoint[];
  period: string;
  summary: string;
}

// Report generation request
export interface ReportGenerateRequest {
  report_type: 'performance' | 'assignments' | 'checkins' | 'system';
  start_date: string;
  end_date: string;
  filters?: {
    employee_ids?: string[];
    doctor_ids?: string[];
    status?: string[];
  };
}

// Report generation response
export interface ReportGenerateResponse {
  report_id: string;
  report_type: string;
  status: string;
  summary: Record<string, any>;
  generated_at: string;
  expires_at: string;
}

// System health response
export interface SystemHealthResponse {
  total_users: number;
  active_users: number;
  data_completeness: number;
  most_active_user: string;
  system_uptime: number;
  average_response_time: number;
  error_rate: number;
  database_health: string;
  last_backup: string;
}

// Analytics service interface
export interface IAnalyticsService {
  getDashboard(): Promise<DashboardResponse>;
  getKPIs(): Promise<KPIsResponse>;
  getEmployeePerformance(): Promise<EmployeePerformanceResponse>;
  getIndividualPerformance(_id: string): Promise<EmployeePerformance>;
  getAssignmentAnalytics(): Promise<AssignmentAnalyticsResponse>;
  getCheckinAnalytics(): Promise<CheckinAnalyticsResponse>;
  getDailyTrends(_days?: number): Promise<TrendResponse>;
  getWeeklyTrends(_weeks?: number): Promise<TrendResponse>;
  generateReport(_data: ReportGenerateRequest): Promise<ReportGenerateResponse>;
  exportCSV(_dataType: string): Promise<Blob>;
  getSystemHealth(): Promise<SystemHealthResponse>;
}
