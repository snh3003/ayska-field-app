import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  ActivityRoundup,
  EmployeeAnalytics,
} from '../../types/AyskaModelsType';

interface AnalyticsState {
  employeeAnalytics: EmployeeAnalytics | null;
  allAnalytics: EmployeeAnalytics[];
  roundups: ActivityRoundup[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  employeeAnalytics: null,
  allAnalytics: [],
  roundups: [],
  loading: false,
  error: null,
};

export const fetchEmployeeAnalytics = createAsyncThunk<
  EmployeeAnalytics,
  { employeeId: string },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchEmployeeAnalytics', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getEmployeeAnalytics(payload.employeeId);
});

export const fetchAllAnalytics = createAsyncThunk<
  EmployeeAnalytics[],
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchAllAnalytics', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getAllEmployeesAnalytics();
});

export const generateRoundup = createAsyncThunk<
  ActivityRoundup,
  { period: 'daily' | 'weekly' },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/generateRoundup', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.generateActivityRoundup(payload.period);
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEmployeeAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAnalytics = action.payload;
      })
      .addCase(fetchEmployeeAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch employee analytics';
      })
      .addCase(fetchAllAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.allAnalytics = action.payload;
      })
      .addCase(fetchAllAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      })
      .addCase(generateRoundup.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRoundup.fulfilled, (state, action) => {
        state.loading = false;
        state.roundups.unshift(action.payload);
      })
      .addCase(generateRoundup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate roundup';
      });
  },
});

export const selectEmployeeAnalytics = (state: RootState) =>
  state.analytics?.employeeAnalytics ?? null;
export const selectAllAnalytics = (state: RootState) =>
  state.analytics?.allAnalytics ?? [];
export const selectRoundups = (state: RootState) =>
  state.analytics?.roundups ?? [];
export const selectAnalyticsLoading = (state: RootState) =>
  state.analytics?.loading ?? false;
export const selectAnalyticsError = (state: RootState) =>
  state.analytics?.error ?? null;

export default analyticsSlice.reducer;
