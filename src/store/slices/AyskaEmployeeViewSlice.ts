import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import { Assignment } from '../../types/AyskaAssignmentApiType';
import { EmployeeProfileResponse } from '../../types/AyskaCheckInApiType';
import { AssignmentService } from '../../services/AyskaAssignmentService';
import { CheckInService } from '../../services/AyskaCheckInService';
import { Doctor } from '../../types/AyskaDoctorApiType';

interface EmployeeViewState {
  myAssignments: Assignment[];
  myProfile: EmployeeProfileResponse | null;
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeViewState = {
  myAssignments: [],
  myProfile: null,
  selectedDoctor: null,
  loading: false,
  error: null,
};

// Fetch my assignments (employee view)
export const fetchMyAssignments = createAsyncThunk(
  'employeeView/fetchMyAssignments',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.getEmployeeAssignments(employeeId);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch assignments';
      return rejectWithValue(message);
    }
  },
);

// Fetch my profile (employee view)
export const fetchMyProfile = createAsyncThunk(
  'employeeView/fetchMyProfile',
  async (_: void, { rejectWithValue }) => {
    try {
      const checkinService = ServiceContainer.getInstance().get(
        'ICheckInService',
      ) as CheckInService;
      const response = await checkinService.getEmployeeProfile();
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch profile';
      return rejectWithValue(message);
    }
  },
);

// Get doctor for check-in
export const getDoctorForCheckin = createAsyncThunk(
  'employeeView/getDoctorForCheckin',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const checkinService = ServiceContainer.getInstance().get(
        'ICheckInService',
      ) as CheckInService;
      const response = await checkinService.getDoctorForCheckIn(doctorId);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch doctor details';
      return rejectWithValue(message);
    }
  },
);

const employeeViewSlice = createSlice({
  name: 'employeeView',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my assignments
    builder
      .addCase(fetchMyAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.myAssignments = action.payload;
        state.error = null;
      })
      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch my profile
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get doctor for check-in
    builder
      .addCase(getDoctorForCheckin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorForCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
        state.error = null;
      })
      .addCase(getDoctorForCheckin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectMyAssignments = (state: RootState) => state.employeeView?.myAssignments ?? [];
export const selectMyProfile = (state: RootState) => state.employeeView?.myProfile ?? null;
export const selectSelectedDoctorForCheckin = (state: RootState) =>
  state.employeeView?.selectedDoctor ?? null;
export const selectEmployeeViewLoading = (state: RootState) => state.employeeView?.loading ?? false;
export const selectEmployeeViewError = (state: RootState) => state.employeeView?.error ?? null;

export const { clearError, clearSelectedDoctor } = employeeViewSlice.actions;
export default employeeViewSlice.reducer;
