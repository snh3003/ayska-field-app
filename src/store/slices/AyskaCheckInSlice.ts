import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  Checkin,
  CheckinQueryParams,
  CheckinRequest,
  CheckinResponse,
} from '../../types/AyskaCheckInApiType';
import { CheckInService } from '../../services/AyskaCheckInService';

interface CheckInStats {
  valid_checkins: number;
  invalid_checkins: number;
  total_doctors_visited: number;
}

interface CheckInState {
  checkins: Checkin[];
  lastCheckin: CheckinResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    has_next: boolean;
  };
  stats: CheckInStats;
}

const initialState: CheckInState = {
  checkins: [],
  lastCheckin: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    has_next: false,
  },
  stats: {
    valid_checkins: 0,
    invalid_checkins: 0,
    total_doctors_visited: 0,
  },
};

// Perform check-in
export const performCheckin = createAsyncThunk(
  'checkin/performCheckin',
  async (data: CheckinRequest, { rejectWithValue }) => {
    try {
      const checkinService = ServiceContainer.getInstance().get(
        'ICheckInService',
      ) as CheckInService;
      const response = await checkinService.submitCheckIn(data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to perform check-in';
      return rejectWithValue(message);
    }
  },
);

// Fetch check-in history
export const fetchCheckinHistory = createAsyncThunk(
  'checkin/fetchCheckinHistory',
  async (params: CheckinQueryParams | undefined, { rejectWithValue }) => {
    try {
      const checkinService = ServiceContainer.getInstance().get(
        'ICheckInService',
      ) as CheckInService;
      const response = await checkinService.getCheckInHistory(params);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch check-in history';
      return rejectWithValue(message);
    }
  },
);

const checkinSlice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastCheckin: (state) => {
      state.lastCheckin = null;
    },
  },
  extraReducers: (builder) => {
    // Perform check-in
    builder
      .addCase(performCheckin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCheckin = action.payload;
        state.error = null;
      })
      .addCase(performCheckin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch check-in history
    builder
      .addCase(fetchCheckinHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckinHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.checkins = action.payload.checkins;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          has_next: action.payload.has_next,
        };
        state.stats = {
          valid_checkins: action.payload.valid_checkins,
          invalid_checkins: action.payload.invalid_checkins,
          total_doctors_visited: action.payload.total_doctors_visited,
        };
        state.error = null;
      })
      .addCase(fetchCheckinHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectCheckins = (state: RootState) => state.checkin?.checkins ?? [];
export const selectLastCheckin = (state: RootState) => state.checkin?.lastCheckin ?? null;
export const selectCheckinLoading = (state: RootState) => state.checkin?.loading ?? false;
export const selectCheckinError = (state: RootState) => state.checkin?.error ?? null;
export const selectCheckinPagination = (state: RootState) =>
  state.checkin?.pagination ?? { total: 0, page: 1, size: 10, has_next: false };
export const selectCheckinStats = (state: RootState) =>
  state.checkin?.stats ?? {
    valid_checkins: 0,
    invalid_checkins: 0,
    total_doctors_visited: 0,
  };

export const { clearError, clearLastCheckin } = checkinSlice.actions;
export default checkinSlice.reducer;
