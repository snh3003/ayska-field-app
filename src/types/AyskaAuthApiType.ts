// Authentication API Types - OTP-based authentication
// Defines types for OTP request, verification, and user profile

// OTP Request payload
export interface OTPRequestPayload {
  identifier: string;
  // identifier_type removed - backend auto-detects email vs phone
}

// OTP Request response
export interface OTPRequestResponse {
  message: string;
  expires_in: number; // seconds
  identifier: string;
  identifier_type: 'email' | 'phone';
}

// OTP Verification payload
export interface OTPVerifyPayload {
  identifier: string;
  otp: string;
}

// OTP Verification response
export interface OTPVerifyResponse {
  access_token: string; // Changed from 'token'
  token_type: string; // Added
  expires_in: number; // seconds
  user: UserProfile;
}

// User profile (returned after successful OTP verification)
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'employee';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  profile_picture?: string;
}

// User profile update payload
export interface UserProfileUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  profile_picture?: string;
}

// User profile response
export interface UserProfileResponse {
  user: UserProfile;
  message?: string;
}

// Logout response
export interface LogoutResponse {
  message: string;
  logged_out_at: string;
}

// Token refresh payload
export interface TokenRefreshPayload {
  refresh_token: string;
}

// Token refresh response
export interface TokenRefreshResponse {
  token: string;
  expires_in: number; // seconds
}

// Password reset request payload (if needed in future)
export interface PasswordResetRequestPayload {
  identifier: string;
  identifier_type: 'email' | 'phone';
}

// Password reset response
export interface PasswordResetResponse {
  message: string;
  expires_in: number; // seconds
}

// Password reset confirm payload
export interface PasswordResetConfirmPayload {
  identifier: string;
  otp: string;
  new_password: string;
}

// Password reset confirm response
export interface PasswordResetConfirmResponse {
  message: string;
}

// Session validation response
export interface SessionValidationResponse {
  valid: boolean;
  user?: UserProfile;
  expires_at?: string;
}

// Account status response
export interface AccountStatusResponse {
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  message?: string;
  restrictions?: string[];
}

// Login attempt tracking
export interface LoginAttemptResponse {
  attempts: number;
  max_attempts: number;
  lockout_until?: string;
  remaining_attempts: number;
}

// Two-factor authentication (if implemented later)
export interface TwoFactorSetupResponse {
  qr_code?: string;
  secret?: string;
  backup_codes: string[];
}

export interface TwoFactorVerifyPayload {
  code: string;
  backup_code?: string;
}

export interface TwoFactorVerifyResponse {
  success: boolean;
  message: string;
}
