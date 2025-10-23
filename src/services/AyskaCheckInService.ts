// Check-in Service - Complete API integration for check-in system
// Implements all check-in operations with backend API calls

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  CheckinHistoryResponse,
  CheckinQueryParams,
  CheckinRequest,
  CheckinResponse,
  EmployeeProfileResponse,
  ICheckInService,
} from '../types/AyskaCheckInApiType';

export class CheckInService implements ICheckInService {
  constructor(private http: HttpClient) {}

  /**
   * Submit check-in for a doctor
   */
  async submitCheckIn(data: CheckinRequest): Promise<CheckinResponse> {
    try {
      const response = await this.http.post<CheckinResponse>(
        '/employee/checkin',
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get check-in history with pagination and filters
   */
  async getCheckInHistory(
    params?: CheckinQueryParams
  ): Promise<CheckinHistoryResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.size) queryParams.append('size', params.size.toString());
      if (params?.doctor_id) queryParams.append('doctor_id', params.doctor_id);
      if (params?.is_valid !== undefined)
        queryParams.append('is_valid', params.is_valid.toString());

      const queryString = queryParams.toString();
      const endpoint = `/employee/checkin/history${queryString ? `?${queryString}` : ''}`;

      const response =
        await this.http.get<CheckinHistoryResponse>(endpoint);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get doctor details for check-in
   */
  async getDoctorForCheckIn(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(
        `/employee/doctors/${id}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get employee profile with performance metrics
   */
  async getEmployeeProfile(): Promise<EmployeeProfileResponse> {
    try {
      const response =
        await this.http.get<EmployeeProfileResponse>('/employee/profile');
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
