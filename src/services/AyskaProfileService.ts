// Profile Service - Real API calls for user profile management
// Implements profile CRUD operations with backend API integration

import { HttpClient } from '../api/HttpClient';
import {
  UserProfile,
  UserProfileUpdatePayload,
} from '../types/AyskaAuthApiType';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';

export interface IProfileService {
  getProfile(): Promise<UserProfile>;
  updateProfile(_updates: UserProfileUpdatePayload): Promise<UserProfile>;
  uploadAvatar(_file: FormData): Promise<{ url: string }>;
  changePassword(_currentPassword: string, _newPassword: string): Promise<void>;
}

export class ProfileService implements IProfileService {
  constructor(private _httpClient: HttpClient) {
    // httpClient will be used for all API calls in the future
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await this._httpClient.get<{ user: UserProfile }>(
        '/profile'
      );
      return response.user;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UserProfileUpdatePayload): Promise<UserProfile> {
    try {
      const response = await this._httpClient.put<{ user: UserProfile }>(
        '/profile',
        updates
      );
      return response.user;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: FormData): Promise<{ url: string }> {
    try {
      const response = await this._httpClient.post<{ url: string }>(
        '/profile/avatar',
        file,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Change user password (if password-based auth is implemented)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await this._httpClient.post('/profile/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}
