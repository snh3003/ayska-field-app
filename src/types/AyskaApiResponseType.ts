// API Response Types - Standard API response wrappers
// Provides consistent typing for all API responses

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Success response
export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error response
export interface ApiErrorResponse extends ApiResponse {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, any>;
}

// Pagination response
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Search parameters
export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

// Common API endpoints response types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
}

// File upload response
export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}

// Bulk operation response
export interface BulkOperationResponse {
  total: number;
  successful: number;
  failed: number;
  errors: {
    index: number;
    error: string;
    data?: any;
  }[];
}

// Export response
export interface ExportResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  expires_at?: string;
  created_at: string;
}

// Generic list response
export interface ListResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// Generic detail response
export interface DetailResponse<T = any> {
  item: T;
}

// Generic create response
export interface CreateResponse<T = any> {
  item: T;
  message?: string;
}

// Generic update response
export interface UpdateResponse<T = any> {
  item: T;
  message?: string;
}

// Generic delete response
export interface DeleteResponse {
  message: string;
  deleted_at: string;
}

// Status response
export interface StatusResponse {
  status: string;
  message?: string;
  timestamp: string;
}

// Backend error response format
export interface BackendErrorResponse {
  error: string; // Error code: "invalid_otp", "user_not_found", etc.
  message: string; // User-friendly message from backend
  status: number; // HTTP status code
  detail?: string; // Optional detail field (used in 401 errors)
}
