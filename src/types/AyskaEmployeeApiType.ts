// Employee API Types - Employee management endpoints
// Defines types for employee CRUD operations

// Employee create payload
export interface EmployeeCreatePayload {
  name: string;
  email?: string;
  phone?: string;
  age: number;
  area_of_operation: string;
}

// Employee update payload
export interface EmployeeUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
  area_of_operation?: string;
  is_active?: boolean;
}

// Employee response (single employee)
export interface EmployeeResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age: number;
  area_of_operation: string;
  role: 'admin' | 'employee';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string; // admin ID
  last_login?: string;
  profile_picture?: string;
}

// Employee list response
export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

// Employee list parameters
export interface EmployeeListParams {
  page?: number;
  size?: number;
  search?: string;
  include_inactive?: boolean;
  area_of_operation?: string;
  sort_by?: 'name' | 'created_at' | 'last_login';
  sort_order?: 'asc' | 'desc';
}

// Employee detail response
export interface EmployeeDetailResponse {
  employee: EmployeeResponse;
  statistics?: {
    total_assignments: number;
    completed_assignments: number;
    total_check_ins: number;
    last_check_in?: string;
    target_achievement_rate: number;
  };
}

// Employee delete response
export interface EmployeeDeleteResponse {
  message: string;
  deleted_at: string;
  permanent: boolean;
}

// Employee reactivate response
export interface EmployeeReactivateResponse {
  message: string;
  reactivated_at: string;
  employee: EmployeeResponse;
}

// Employee bulk operations
export interface EmployeeBulkCreatePayload {
  employees: EmployeeCreatePayload[];
}

export interface EmployeeBulkCreateResponse {
  total: number;
  successful: number;
  failed: number;
  employees: EmployeeResponse[];
  errors: {
    index: number;
    error: string;
    data: EmployeeCreatePayload;
  }[];
}

export interface EmployeeBulkUpdatePayload {
  employee_ids: string[];
  updates: EmployeeUpdatePayload;
}

export interface EmployeeBulkUpdateResponse {
  total: number;
  successful: number;
  failed: number;
  employees: EmployeeResponse[];
  errors: {
    employee_id: string;
    error: string;
  }[];
}

export interface EmployeeBulkDeletePayload {
  employee_ids: string[];
  permanent?: boolean;
}

export interface EmployeeBulkDeleteResponse {
  total: number;
  successful: number;
  failed: number;
  deleted_at: string;
  permanent: boolean;
  errors: {
    employee_id: string;
    error: string;
  }[];
}

// Employee search response
export interface EmployeeSearchResponse {
  employees: EmployeeResponse[];
  total: number;
  query: string;
  filters_applied: Record<string, any>;
}

// Employee statistics response
export interface EmployeeStatisticsResponse {
  total_employees: number;
  active_employees: number;
  inactive_employees: number;
  new_this_month: number;
  by_area: {
    area: string;
    count: number;
  }[];
  by_age_group: {
    age_group: string;
    count: number;
  }[];
}

// Employee export response
export interface EmployeeExportResponse {
  export_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
  created_at: string;
  format: 'csv' | 'xlsx' | 'pdf';
  filters_applied: Record<string, any>;
}

// Employee import response
export interface EmployeeImportResponse {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_rows: number;
  successful_rows: number;
  failed_rows: number;
  errors: {
    row: number;
    error: string;
    data: Record<string, any>;
  }[];
  created_at: string;
}
