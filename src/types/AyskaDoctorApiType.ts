// Doctor API Types - Complete type definitions for doctor management
// Covers all doctor-related API endpoints and responses

// Doctor model
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  age?: number;
  location_lat: number;
  location_lng: number;
  location_address: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Create doctor payload
export interface CreateDoctorPayload {
  name: string;
  specialization: string;
  phone: string;
  email: string;
  age?: number;
  location_lat: number;
  location_lng: number;
  location_address: string;
}

// Update doctor payload (partial)
export interface UpdateDoctorPayload {
  name?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  age?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

// Create doctor response
export interface CreateDoctorResponse {
  message: string;
  doctor_id: string;
  name: string;
  specialization: string;
}

// Doctor list response with pagination
export interface DoctorListResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

// Doctor query parameters
export interface DoctorQueryParams {
  page?: number;
  size?: number;
  search?: string;
  specialization?: string;
}

// Doctor service interface
export interface IDoctorService {
  getDoctors(_params?: DoctorQueryParams): Promise<DoctorListResponse>;
  getDoctorById(_id: string): Promise<Doctor>;
  createDoctor(_data: CreateDoctorPayload): Promise<CreateDoctorResponse>;
  updateDoctor(_id: string, _data: UpdateDoctorPayload): Promise<Doctor>;
  deleteDoctor(_id: string): Promise<void>;
}
