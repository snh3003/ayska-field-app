// Employee Service - Real API calls for employee management
// Implements employee CRUD operations with backend API integration

import { HttpClient } from '../api/HttpClient';
import { Employee } from '../types/AyskaModelsType';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  PaginatedResponse,
  PaginationParams,
} from '../types/AyskaApiResponseType';

export interface IEmployeeService {
  getEmployees(
    _params?: PaginationParams
  ): Promise<PaginatedResponse<Employee>>;
  getEmployeeById(_id: string): Promise<Employee>;
  createEmployee(_employee: CreateEmployeePayload): Promise<Employee>;
  updateEmployee(
    _id: string,
    _updates: UpdateEmployeePayload
  ): Promise<Employee>;
  deleteEmployee(_id: string): Promise<void>;
  getEmployeeAnalytics(_id: string): Promise<any>;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  age: number;
  areaOfOperation: string;
  adminId: string;
}

export interface UpdateEmployeePayload {
  name?: string;
  email?: string;
  age?: number;
  areaOfOperation?: string;
}

export class EmployeeService implements IEmployeeService {
  constructor(private _httpClient: HttpClient) {
    // httpClient will be used for all API calls in the future
  }

  /**
   * Get paginated list of employees
   */
  async getEmployees(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Employee>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size)
        queryParams.append('page_size', params.page_size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.sort_order)
        queryParams.append('sort_order', params.sort_order);

      const url = `/employees/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response =
        await this._httpClient.get<PaginatedResponse<Employee>>(url);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await this._httpClient.get<Employee>(`/employees/${id}`);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Create new employee
   */
  async createEmployee(employee: CreateEmployeePayload): Promise<Employee> {
    try {
      const response = await this._httpClient.post<Employee>(
        '/employees/',
        employee
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(
    id: string,
    updates: UpdateEmployeePayload
  ): Promise<Employee> {
    try {
      const response = await this._httpClient.put<Employee>(
        `/employees/${id}`,
        updates
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id: string): Promise<void> {
    try {
      await this._httpClient.delete(`/employees/${id}`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get employee analytics
   */
  async getEmployeeAnalytics(id: string): Promise<any> {
    try {
      const response = await this._httpClient.get<any>(
        `/employees/${id}/analytics`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
