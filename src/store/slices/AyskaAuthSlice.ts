import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserRole } from '../../types';
import { ServiceContainer } from '../../di/ServiceContainer';
import { IAuthService } from '../../services/AyskaAuthService';
// UserProfile import removed - not used in this file

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
  name: null,
  loading: false,
  error: null,
};

// OTP request thunk
export const requestOTP = createAsyncThunk(
  'auth/requestOTP',
  async (identifier: string, { rejectWithValue }) => {
    try {
      const authService = ServiceContainer.getInstance().get('IAuthService') as IAuthService;
      const response = await authService.requestOTP(identifier);
      return response;
    } catch (error: any) {
      // Error is already mapped by ErrorInterceptor to ApiError object
      const message = error.message || 'Failed to send OTP';
      return rejectWithValue(message);
    }
  },
);

// OTP verification and login thunk
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ identifier, otp }: { identifier: string; otp: string }, { rejectWithValue }) => {
    try {
      const authService = ServiceContainer.getInstance().get('IAuthService') as IAuthService;
      const response = await authService.verifyOTP(identifier, otp);

      // Store token and user data
      const authStorage = ServiceContainer.getInstance().get('IAuthStorage') as any;
      await authStorage.setToken(response.access_token);
      await authStorage.setUser(response.user);

      return {
        token: response.access_token,
        role: response.user.role as Exclude<UserRole, null>,
        userId: response.user.id,
        name: response.user.name,
        user: response.user,
      };
    } catch (error: any) {
      // Error is already mapped by ErrorInterceptor to ApiError object
      const message = error.message || 'Invalid verification code';
      return rejectWithValue(message);
    }
  },
);

// Get user profile thunk
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_: void, { rejectWithValue }) => {
    try {
      const authService = ServiceContainer.getInstance().get('IAuthService') as IAuthService;
      const user = await authService.getProfile();
      return user;
    } catch (error: any) {
      // Error is already mapped by ErrorInterceptor to ApiError object
      const message = error.message || 'Failed to get profile';
      return rejectWithValue(message);
    }
  },
);

// Logout thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_: void, { rejectWithValue: _rejectWithValue }) => {
    try {
      const authService = ServiceContainer.getInstance().get('IAuthService') as IAuthService;
      await authService.logout();

      // Clear local storage
      const authStorage = ServiceContainer.getInstance().get('IAuthStorage') as any;
      await authStorage.clearAll();

      return true;
    } catch {
      // Even if logout fails on server, clear local data
      const authStorage = ServiceContainer.getInstance().get('IAuthStorage') as any;
      await authStorage.clearAll();
      return true;
    }
  },
);

// Legacy login thunk for backward compatibility
export const login = createAsyncThunk(
  'auth/login',
  async ({
    email: _email,
    role,
    userId,
    name,
  }: {
    email: string;
    role: Exclude<UserRole, null>;
    userId: string;
    name: string;
  }) => {
    // This is now handled by verifyOTP, but keeping for compatibility
    return {
      token: `local-${userId}`,
      role,
      userId,
      name,
    };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; role: Exclude<UserRole, null> }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearError(state) {
      state.error = null;
    },
    setUser(
      state,
      action: PayloadAction<{
        userId: string;
        name: string;
        role: Exclude<UserRole, null>;
      }>,
    ) {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    // OTP Request
    builder
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // OTP Verification
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.name = action.payload.name;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.id;
        state.name = action.payload.name;
        state.role = action.payload.role as Exclude<UserRole, null>;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.role = null;
        state.userId = null;
        state.name = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        // Even if logout fails, clear local state
        state.token = null;
        state.role = null;
        state.userId = null;
        state.name = null;
        state.error = null;
      });

    // Legacy login for backward compatibility
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.name = action.payload.name;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { setCredentials, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
