// Authentication Service - Real API calls for OTP-based authentication
// Implements authentication flow with backend API integration

import { HttpClient } from '../api/HttpClient';
import {
  OTPRequestPayload,
  OTPRequestResponse,
  OTPVerifyPayload,
  OTPVerifyResponse,
  UserProfile,
} from '../types/AyskaAuthApiType';

export interface IAuthService {
  requestOTP(_identifier: string): Promise<OTPRequestResponse>;
  verifyOTP(_identifier: string, _otp: string): Promise<OTPVerifyResponse>;
  getProfile(): Promise<UserProfile>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}

export class AuthService implements IAuthService {
  constructor(private _httpClient: HttpClient) {
    // httpClient will be used for all API calls in the future
  }

  /**
   * Request OTP for authentication
   */
  async requestOTP(identifier: string): Promise<OTPRequestResponse> {
    const payload: OTPRequestPayload = { identifier };
    const response = await this._httpClient.post<OTPRequestResponse>('/auth/otp/request', payload);
    return response;
  }

  /**
   * Verify OTP and get authentication token
   */
  async verifyOTP(identifier: string, otp: string): Promise<OTPVerifyResponse> {
    const payload: OTPVerifyPayload = { identifier, otp };
    const response = await this._httpClient.post<OTPVerifyResponse>('/auth/otp/verify', payload);
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await this._httpClient.get<{ user: UserProfile }>('/auth/profile');
    return response.user;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this._httpClient.post('/auth/logout');
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string> {
    const response = await this._httpClient.post<{ access_token: string }>('/auth/refresh');
    return response.access_token;
  }
}
