// Shared utility types and common interfaces
import { AccessibilityRole } from 'react-native';

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (_value: any) => boolean;
  message?: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

// Accessibility types

export interface A11yProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: {
    disabled?: boolean;
    checked?: boolean;
    selected?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}

// Common utility types
export interface DateRange {
  start: string;
  end: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Generic CRUD operations
export interface CreateRequest<T> {
  data: Omit<T, 'id'>;
}

export interface UpdateRequest<T> {
  id: string;
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string;
}

// Common status types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
export type AsyncStatus = 'pending' | 'fulfilled' | 'rejected';
