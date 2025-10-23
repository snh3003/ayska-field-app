// Check-in Redux Slice - Complete state management for check-in operations
// Implements all check-in operations with proper error handling

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  CheckinHistoryResponse,
  CheckinQueryParams,
  CheckinRequest,
  CheckinResponse,
  EmployeeProfileResponse,
} from '../../types/AyskaCheckInApiType';

// State interface
interface CheckInState {
  checkinHistory: any[];
  currentCheckIn: any | null;
  employeeProfile: EmployeeProfileResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
    validCheckins: number;
    invalidCheckins: number;
    totalDoctorsVisited: number;
  };
  filters: CheckinQueryParams;
  lastCheckIn: CheckinResponse | null;
}

// Initial state
const initialState: CheckInState = {
  checkinHistory: [],
  currentCheckIn: null,
  employeeProfile: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    hasNext: false,
    validCheckins: 0,
    invalidCheckins: 0,
    totalDoctorsVisited: 0,
  },
  filters: {},
  lastCheckIn: null,
};

// Async thunks
export const submitCheckIn = createAsyncThunk<
  CheckinResponse,
  CheckinRequest,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkin/submitCheckIn', async (data, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('ICheckInService') as any;
  return service.submitCheckIn(data);
});

export const fetchCheckInHistory = createAsyncThunk<
  CheckinHistoryResponse,
  CheckinQueryParams | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkin/fetchCheckInHistory', async (params, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('ICheckInService') as any;
  return service.getCheckInHistory(params);
});

export const fetchDoctorForCheckIn = createAsyncThunk<
  any,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkin/fetchDoctorForCheckIn', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('ICheckInService') as any;
  return service.getDoctorForCheckIn(id);
});

export const fetchEmployeeProfile = createAsyncThunk<
  EmployeeProfileResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkin/fetchEmployeeProfile', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('ICheckInService') as any;
  return service.getEmployeeProfile();
});

// Slice
const checkInSlice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<CheckinQueryParams>) => {
      state.filters = action.payload;
    },
    clearCurrentCheckIn: state => {
      state.currentCheckIn = null;
    },
    clearLastCheckIn: state => {
      state.lastCheckIn = null;
    },
  },
  extraReducers: builder => {
    // Submit check-in
    builder
      .addCase(submitCheckIn.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckIn = action.payload;
        // Add to history if it's a valid check-in
        if (action.payload.is_valid) {
          state.checkinHistory.unshift({
            id: action.payload.checkin_id,
            is_valid: action.payload.is_valid,
            distance_meters: action.payload.distance_meters,
            checkin_time: new Date().toISOString(),
          });
          state.pagination.total += 1;
          state.pagination.validCheckins += 1;
        } else {
          state.pagination.invalidCheckins += 1;
        }
      })
      .addCase(submitCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit check-in';
      });

    // Fetch check-in history
    builder
      .addCase(fetchCheckInHistory.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckInHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.checkinHistory = action.payload.checkins;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          hasNext: action.payload.has_next,
          validCheckins: action.payload.valid_checkins,
          invalidCheckins: action.payload.invalid_checkins,
          totalDoctorsVisited: action.payload.total_doctors_visited,
        };
      })
      .addCase(fetchCheckInHistory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch check-in history';
      });

    // Fetch doctor for check-in
    builder
      .addCase(fetchDoctorForCheckIn.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorForCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckIn = action.payload;
      })
      .addCase(fetchDoctorForCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctor details';
      });

    // Fetch employee profile
    builder
      .addCase(fetchEmployeeProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeProfile = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch employee profile';
      });
  },
});

// Actions
export const { clearError, setFilters, clearCurrentCheckIn, clearLastCheckIn } =
  checkInSlice.actions;

// Selectors
export const selectCheckInHistory = (state: RootState) =>
  state.checkIn?.checkinHistory ?? [];
export const selectCurrentCheckIn = (state: RootState) =>
  state.checkIn?.currentCheckIn ?? null;
export const selectEmployeeProfile = (state: RootState) =>
  state.checkIn?.employeeProfile ?? null;
export const selectCheckInLoading = (state: RootState) =>
  state.checkIn?.loading ?? false;
export const selectCheckInError = (state: RootState) =>
  state.checkIn?.error ?? null;
export const selectCheckInPagination = (state: RootState) =>
  state.checkIn?.pagination ?? {
    total: 0,
    page: 1,
    size: 10,
    hasNext: false,
    validCheckins: 0,
    invalidCheckins: 0,
    totalDoctorsVisited: 0,
  };
export const selectCheckInFilters = (state: RootState) =>
  state.checkIn?.filters ?? {};
export const selectLastCheckIn = (state: RootState) =>
  state.checkIn?.lastCheckIn ?? null;

export default checkInSlice.reducer;
