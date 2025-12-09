// Employee Service - Complete API integration for employee management
// Implements all employee CRUD operations with backend API calls

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  EmployeeCreatePayload,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeResponse,
  EmployeeUpdatePayload,
} from '../types/AyskaEmployeeApiType';

export class EmployeeService {
  constructor(private _http: HttpClient) {}

  /**
   * Get all employees with pagination and filters
   */
  async getEmployees(params?: EmployeeListParams): Promise<EmployeeListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.size) queryParams.append('size', params.size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.include_inactive !== undefined) {
        queryParams.append('include_inactive', params.include_inactive.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/admin/employees${queryString ? `?${queryString}` : ''}`;

      const response = await this._http.get<EmployeeListResponse>(endpoint);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<EmployeeResponse> {
    try {
      const response = await this._http.get<EmployeeResponse>(`/admin/employees/${id}`);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(data: EmployeeCreatePayload): Promise<EmployeeResponse> {
    try {
      const response = await this._http.post<EmployeeResponse>('/admin/employees', data);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update employee details
   */
  async updateEmployee(id: string, data: EmployeeUpdatePayload): Promise<EmployeeResponse> {
    try {
      const response = await this._http.put<EmployeeResponse>(`/admin/employees/${id}`, data);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Delete employee (soft delete)
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      await this._http.delete(`/admin/employees/${id}`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Reactivate inactive employee
   */
  async reactivateEmployee(id: string): Promise<EmployeeResponse> {
    try {
      const response = await this._http.post<EmployeeResponse>(`/admin/employees/${id}/reactivate`);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
