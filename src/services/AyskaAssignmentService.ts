// Assignment Service - Complete API integration for assignment management
// Implements all assignment CRUD operations with backend API calls

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  Assignment,
  AssignmentListResponse,
  AssignmentProgressUpdate,
  AssignmentQueryParams,
  AssignmentStatusUpdate,
  CreateAssignmentPayload,
  IAssignmentService,
  UpdateAssignmentPayload,
} from '../types/AyskaAssignmentApiType';

export class AssignmentService implements IAssignmentService {
  constructor(private _http: HttpClient) {}

  /**
   * Get all assignments with pagination and filters
   */
  async getAssignments(
    params?: AssignmentQueryParams
  ): Promise<AssignmentListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.size) queryParams.append('size', params.size.toString());
      if (params?.employee_id)
        queryParams.append('employee_id', params.employee_id);
      if (params?.doctor_id) queryParams.append('doctor_id', params.doctor_id);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/admin/assignments${queryString ? `?${queryString}` : ''}`;

      const response = await this._http.get<AssignmentListResponse>(endpoint);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get assignment by ID
   */
  async getAssignmentById(id: string): Promise<Assignment> {
    try {
      const response = await this._http.get<Assignment>(
        `/admin/assignments/${id}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Create new assignment
   */
  async createAssignment(data: CreateAssignmentPayload): Promise<Assignment> {
    try {
      const response = await this._http.post<Assignment>(
        '/admin/assignments',
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update assignment details
   */
  async updateAssignment(
    id: string,
    data: UpdateAssignmentPayload
  ): Promise<Assignment> {
    try {
      const response = await this._http.put<Assignment>(
        `/admin/assignments/${id}`,
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update assignment progress
   */
  async updateAssignmentProgress(
    id: string,
    data: AssignmentProgressUpdate
  ): Promise<Assignment> {
    try {
      const response = await this._http.patch<Assignment>(
        `/admin/assignments/${id}/progress`,
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update assignment status
   */
  async updateAssignmentStatus(
    id: string,
    data: AssignmentStatusUpdate
  ): Promise<Assignment> {
    try {
      const response = await this._http.patch<Assignment>(
        `/admin/assignments/${id}/status`,
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(id: string): Promise<void> {
    try {
      await this._http.delete(`/admin/assignments/${id}`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get assignments for specific employee
   */
  async getEmployeeAssignments(employeeId: string): Promise<Assignment[]> {
    try {
      const response = await this._http.get<Assignment[]>(
        `/admin/assignments/employee/${employeeId}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
