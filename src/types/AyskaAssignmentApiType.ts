// Assignment API Types - Complete type definitions for assignment management
// Covers all assignment-related API endpoints and responses

// Assignment model
export interface Assignment {
  id: string;
  employee_id: string;
  doctor_id: string;
  target: number;
  current_progress: number;
  status: 'active' | 'completed' | 'cancelled';
  assigned_date: string;
  created_at: string;
  updated_at: string;
  assigned_by: string;
  employee_name?: string;
  doctor_name?: string;
  progress_percentage?: number;
  is_completed?: boolean;
  doctor_specialization?: string;
}

// Create assignment payload
export interface CreateAssignmentPayload {
  employee_id: string;
  doctor_id: string;
  target: number;
}

// Update assignment payload
export interface UpdateAssignmentPayload {
  target?: number;
}

// Assignment progress update
export interface AssignmentProgressUpdate {
  current_progress: number;
}

// Assignment status update
export interface AssignmentStatusUpdate {
  status: 'active' | 'completed' | 'cancelled';
}

// Assignment list response with pagination
export interface AssignmentListResponse {
  assignments: Assignment[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

// Assignment query parameters
export interface AssignmentQueryParams {
  page?: number;
  size?: number;
  employee_id?: string;
  doctor_id?: string;
  status?: string;
  search?: string;
}

// Assignment service interface
export interface IAssignmentService {
  getAssignments(_params?: AssignmentQueryParams): Promise<AssignmentListResponse>;
  getAssignmentById(_id: string): Promise<Assignment>;
  createAssignment(_data: CreateAssignmentPayload): Promise<Assignment>;
  updateAssignment(_id: string, _data: UpdateAssignmentPayload): Promise<Assignment>;
  updateAssignmentProgress(_id: string, _data: AssignmentProgressUpdate): Promise<Assignment>;
  updateAssignmentStatus(_id: string, _data: AssignmentStatusUpdate): Promise<Assignment>;
  deleteAssignment(_id: string): Promise<void>;
  getEmployeeAssignments(_employeeId: string): Promise<Assignment[]>;
}
