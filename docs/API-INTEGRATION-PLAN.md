# API Integration Plan - Frontend Implementation Guide

## Quick Start Guide

### Base Configuration

- **Base URL**: `http://localhost:8000/api/v1`
- **Required Headers**:
  - `Authorization: Bearer {token}` (for authenticated requests)
  - `Content-Type: application/json`
- **Timeout**: 15000ms
- **Dev Mode**: OTP codes are logged to console for testing

### Environment Setup

```typescript
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

## Authentication Flow Implementation

### Step 1: Request OTP

**Endpoint**: `POST /api/v1/auth/otp/request`

```typescript
// Request payload
interface OTPRequestPayload {
  identifier: string; // Email or phone number
}

// Response
interface OTPRequestResponse {
  message: string;
  expires_in: number; // seconds
  identifier: string;
  identifier_type: 'email' | 'phone';
}
```

**Implementation**:

```typescript
const requestOTP = async (identifier: string): Promise<OTPRequestResponse> => {
  const response = await httpClient.post('/auth/otp/request', { identifier });
  return response.data;
};
```

### Step 2: Verify OTP

**Endpoint**: `POST /api/v1/auth/otp/verify`

```typescript
// Request payload
interface OTPVerifyPayload {
  identifier: string;
  otp: string;
}

// Response
interface OTPVerifyResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // seconds
  user: UserProfile;
}
```

**Implementation**:

```typescript
const verifyOTP = async (
  identifier: string,
  otp: string
): Promise<OTPVerifyResponse> => {
  const response = await httpClient.post('/auth/otp/verify', {
    identifier,
    otp,
  });
  return response.data;
};
```

### Step 3: Store JWT Token

```typescript
// Store token securely
await authStorage.setToken(response.access_token);
await authStorage.setUser(response.user);
```

### Step 4: Use Token in Requests

```typescript
// Add to HTTP interceptor
httpClient.interceptors.request.use(config => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 5: Handle 401 (Redirect to Login)

```typescript
httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authStorage.clearToken();
      // Redirect to login screen
      navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);
```

### Step 6: Logout Flow

```typescript
const logout = async (): Promise<void> => {
  try {
    await httpClient.post('/auth/logout');
  } finally {
    authStorage.clearToken();
    authStorage.clearUser();
    // Redirect to login
  }
};
```

## Error Handling Strategy

### Backend Error Response Format

```typescript
interface BackendErrorResponse {
  error: string; // Error code: "invalid_otp", "user_not_found", etc.
  message: string; // User-friendly message from backend
  status: number; // HTTP status code
  detail?: string; // Optional detail field
}
```

### Error Mapping Implementation

```typescript
// Priority order for error messages:
// 1. Backend error field (data.error)
// 2. Backend message field (data.message)
// 3. Hardcoded fallback messages

const mapError = (error: any): ApiError => {
  const data = error.response?.data || {};

  // Check backend error code first
  if (data.error) {
    const backendError = mapBackendErrorCode(data.error);
    if (backendError) {
      return {
        code: error.response.status,
        title: backendError.title,
        message: backendError.message,
      };
    }
  }

  // Use backend message as primary
  if (data.message) {
    return {
      code: error.response.status,
      title: getTitleFromMessage(data.message),
      message: data.message,
    };
  }

  // Fall back to hardcoded messages
  return getFallbackError(error.response.status);
};
```

### Error Scenarios from user-scenarios.md

| Scenario                | Error Code           | User Message                                    |
| ----------------------- | -------------------- | ----------------------------------------------- |
| Invalid OTP (3)         | `invalid_otp`        | "Incorrect OTP. Try again."                     |
| OTP Expired (4)         | `otp_expired`        | "OTP expired. Request a new one."               |
| Too Many Attempts (5)   | `too_many_attempts`  | "Too many attempts. Request new OTP."           |
| User Not Found (6)      | `user_not_found`     | "Account not found. Contact your admin."        |
| Account Inactive (7)    | `account_inactive`   | "Account deactivated. Contact your admin."      |
| Duplicate Employee (12) | `duplicate_employee` | "Email or phone already exists."                |
| Employee Not Found (13) | `employee_not_found` | "Employee not found."                           |
| Network Error (17)      | Network              | "Please check your internet connection."        |
| Server Error (19)       | 500                  | "Something went wrong. Please try again later." |
| Validation Error (23)   | 422                  | "Please check your input and try again."        |

## Phase 2 Implementation Roadmap

### 2.1 Create API Service Layer

**Files to create**:

- `src/services/AyskaAuthService.ts` - Authentication API calls
- `src/services/AyskaEmployeeService.ts` - Employee management API calls
- `src/services/AyskaHttpServiceBase.ts` - Base HTTP service with interceptors

### 2.2 Update Login Screen

**File**: `app/login.tsx`

- Replace mock OTP logic with real API calls
- Use `AuthService.requestOTP()` and `AuthService.verifyOTP()`
- Handle real error responses from backend

### 2.3 Implement Token Storage

**Files to update**:

- `src/services/AyskaAuthStorageServiceService.ts` - Add token management
- `src/di/ServiceContainer.ts` - Register AuthService

### 2.4 Add Request Interceptors

**File**: `src/interceptors/AyskaAuthInterceptorInterceptor.ts`

- Auto-add Authorization header to requests
- Handle token refresh logic

### 2.5 Implement Error Interceptor

**File**: `src/interceptors/AyskaErrorInterceptorInterceptor.ts`

- Use updated ApiErrorHandler
- Show backend error messages to users
- Handle 401/403 redirects

### 2.6 Update Redux Thunks

**Files to update**:

- `src/store/slices/AyskaAuthSliceSlice.ts` - Use real API calls
- All other slices that make API calls

## Endpoint Integration Checklist

### Priority 1: Authentication (5 endpoints)

- [ ] `POST /auth/otp/request` - Request OTP
- [ ] `POST /auth/otp/verify` - Verify OTP
- [ ] `GET /auth/profile` - Get user profile
- [ ] `POST /auth/logout` - Logout
- [ ] `POST /auth/refresh` - Refresh token

### Priority 2: Employee Management (6 endpoints)

- [ ] `GET /employees/` - List employees
- [ ] `POST /employees/` - Create employee
- [ ] `GET /employees/{id}` - Get employee details
- [ ] `PUT /employees/{id}` - Update employee
- [ ] `DELETE /employees/{id}` - Delete employee
- [ ] `GET /employees/{id}/analytics` - Employee analytics

### Priority 3: Profile Management

- [ ] `GET /profile` - Get current user profile
- [ ] `PUT /profile` - Update profile
- [ ] `POST /profile/avatar` - Upload avatar

## Code Examples

### Complete Login Flow Implementation

```typescript
// Login screen implementation
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const authService = serviceContainer.get('IAuthService') as IAuthService;

  const sendOTP = async () => {
    try {
      setLoading(true);
      const response = await authService.requestOTP(email);
      setOtpSent(true);
      showToast(response.message, 'success');
    } catch (error) {
      const apiError = ApiErrorHandler.mapError(error);
      showToast(apiError.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await authService.verifyOTP(email, otp);

      // Store token and user data
      await authStorage.setToken(response.access_token);
      await authStorage.setUser(response.user);

      // Navigate to main app
      navigation.navigate('Main');
    } catch (error) {
      const apiError = ApiErrorHandler.mapError(error);
      showToast(apiError.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    // UI implementation
  );
};
```

### Employee CRUD Operations

```typescript
// Employee service implementation
class EmployeeService implements IEmployeeService {
  async getEmployees(): Promise<Employee[]> {
    const response = await httpClient.get('/employees/');
    return response.data;
  }

  async createEmployee(employee: CreateEmployeePayload): Promise<Employee> {
    const response = await httpClient.post('/employees/', employee);
    return response.data;
  }

  async updateEmployee(
    id: string,
    updates: UpdateEmployeePayload
  ): Promise<Employee> {
    const response = await httpClient.put(`/employees/${id}`, updates);
    return response.data;
  }

  async deleteEmployee(id: string): Promise<void> {
    await httpClient.delete(`/employees/${id}`);
  }
}
```

### Error Handling Examples

```typescript
// Error handling in components
const handleApiCall = async () => {
  try {
    const result = await apiService.someMethod();
    showToast('Success!', 'success');
  } catch (error) {
    const apiError = ApiErrorHandler.mapError(error);

    // Show user-friendly error
    showToast(apiError.message, 'error');

    // Handle specific error codes
    if (apiError.code === 401) {
      // Redirect to login
      navigation.navigate('Login');
    }
  }
};
```

### Token Refresh Logic

```typescript
// Token refresh implementation
const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = authStorage.getRefreshToken();
    const response = await httpClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const newToken = response.data.access_token;
    await authStorage.setToken(newToken);
    return newToken;
  } catch (error) {
    // Refresh failed, redirect to login
    authStorage.clearToken();
    navigation.navigate('Login');
    return null;
  }
};
```

## Testing Strategy

### 1. Backend Integration Testing

```bash
# Start backend server
cd backend && python manage.py runserver

# Test endpoints with curl
curl -X POST http://localhost:8000/api/v1/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"identifier": "test@example.com"}'
```

### 2. Frontend Testing

```typescript
// Test with backend running
const testLoginFlow = async () => {
  // 1. Request OTP
  const otpResponse = await authService.requestOTP('test@example.com');
  console.log('OTP sent:', otpResponse.message);

  // 2. Check console for OTP code (dev mode)
  // 3. Verify OTP
  const verifyResponse = await authService.verifyOTP(
    'test@example.com',
    '1234'
  );
  console.log('Login successful:', verifyResponse.user);
};
```

### 3. Error Scenario Testing

Test all error scenarios from `user-scenarios.md`:

- Invalid OTP
- Expired OTP
- Too many attempts
- User not found
- Account inactive
- Network errors
- Server errors

### 4. Swagger UI Testing

- Access: `http://localhost:8000/docs`
- Test all endpoints interactively
- Verify request/response formats
- Test error responses

## Implementation Checklist

### Phase 1.1: Service Cleanup ✅

- [x] Remove AuthRepository (obsolete)
- [x] Remove EmailService (obsolete)
- [x] Update OnboardingService
- [x] Update ServiceContainer
- [x] Update toast duration to 10s

### Phase 1: Error Handling ✅

- [x] Update API response types
- [x] Update error handler to prioritize backend messages
- [x] Update auth API types to match backend
- [x] Map all error scenarios from user-scenarios.md

### Phase 2: API Integration (Next)

- [ ] Create AuthService with real API calls
- [ ] Update login screen to use real endpoints
- [ ] Implement token storage and refresh
- [ ] Add request interceptors for auth headers
- [ ] Update error interceptor with backend error mapping
- [ ] Update Redux thunks to call real APIs

## Success Criteria

- [x] Error messages shown to users come directly from backend API
- [x] All error scenarios from `user-scenarios.md` are mapped correctly
- [x] Comprehensive integration plan document exists for Phase 2 implementation
- [x] Service layer foundation is ready for actual API integration
- [x] Type safety maintained throughout with proper TypeScript interfaces

## Next Steps

1. **Start Backend Server**: Ensure backend is running on `http://localhost:8000`
2. **Implement AuthService**: Create real API service for authentication
3. **Update Login Screen**: Replace mock logic with real API calls
4. **Test Integration**: Verify all error scenarios work correctly
5. **Implement Employee APIs**: Add employee management endpoints
6. **Add Profile Management**: Implement user profile updates

---

**Note**: This plan provides a complete roadmap for integrating the frontend with the backend API. All error handling is now configured to prioritize backend messages, and the service layer is prepared for real API integration.
