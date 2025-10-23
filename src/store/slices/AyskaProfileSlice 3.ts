// Profile Redux Slice - Real API integration for user profile management
// Implements profile CRUD operations with backend API calls

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceContainer } from '../../di/ServiceContainer';
import { IProfileService } from '../../services/AyskaProfileService';
import {
  UserProfile,
  UserProfileUpdatePayload,
} from '../../types/AyskaAuthApiType';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  avatarUploading: boolean;
  avatarUploadError: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  avatarUploading: false,
  avatarUploadError: null,
};

// Get user profile
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_: void, { rejectWithValue }) => {
    try {
      const profileService = ServiceContainer.getInstance().get(
        'IProfileService'
      ) as IProfileService;
      const profile = await profileService.getProfile();
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updates: UserProfileUpdatePayload, { rejectWithValue }) => {
    try {
      const profileService = ServiceContainer.getInstance().get(
        'IProfileService'
      ) as IProfileService;
      const profile = await profileService.updateProfile(updates);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Upload avatar
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (file: FormData, { rejectWithValue }) => {
    try {
      const profileService = ServiceContainer.getInstance().get(
        'IProfileService'
      ) as IProfileService;
      const result = await profileService.uploadAvatar(file);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Change password (if password-based auth is implemented)
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const profileService = ServiceContainer.getInstance().get(
        'IProfileService'
      ) as IProfileService;
      await profileService.changePassword(currentPassword, newPassword);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearAvatarUploadError(state) {
      state.avatarUploadError = null;
    },
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: builder => {
    // Get Profile
    builder
      .addCase(getProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, state => {
        state.avatarUploading = true;
        state.avatarUploadError = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.avatarUploading = false;
        if (state.profile) {
          state.profile.profile_picture = action.payload.url;
        }
        state.avatarUploadError = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.avatarUploading = false;
        state.avatarUploadError = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearAvatarUploadError, setProfile, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;
