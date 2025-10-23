// Doctor Service - Complete API integration for doctor management
// Implements all doctor CRUD operations with backend API calls

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  CreateDoctorPayload,
  CreateDoctorResponse,
  Doctor,
  DoctorListResponse,
  DoctorQueryParams,
  IDoctorService,
  UpdateDoctorPayload,
} from '../types/AyskaDoctorApiType';

export class DoctorService implements IDoctorService {
  constructor(private http: HttpClient) {}

  /**
   * Get all doctors with pagination and search
   */
  async getDoctors(params?: DoctorQueryParams): Promise<DoctorListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.size) queryParams.append('size', params.size.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.specialization)
        queryParams.append('specialization', params.specialization);

      const queryString = queryParams.toString();
      const endpoint = `/admin/doctors${queryString ? `?${queryString}` : ''}`;

      const response = await this.http.get<DoctorListResponse>(endpoint);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get doctor by ID
   */
  async getDoctorById(id: string): Promise<Doctor> {
    try {
      const response = await this.http.get<Doctor>(
        `/admin/doctors/${id}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Create new doctor
   */
  async createDoctor(data: CreateDoctorPayload): Promise<CreateDoctorResponse> {
    try {
      const response = await this.http.post<CreateDoctorResponse>(
        '/admin/doctors',
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update doctor information
   */
  async updateDoctor(id: string, data: UpdateDoctorPayload): Promise<Doctor> {
    try {
      const response = await this.http.put<Doctor>(
        `/admin/doctors/${id}`,
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Delete doctor
   */
  async deleteDoctor(id: string): Promise<void> {
    try {
      await this.http.delete(`/admin/doctors/${id}`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
