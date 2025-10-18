import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { Activity, SubmitActivityRequest } from '../../types/AyskaApiType';
import { ServiceContainer } from '../../di/ServiceContainer';

interface EmployeeState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk<
  Activity[],
  { employeeId: string },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('employee/fetchActivities', async ({ employeeId }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IEmployeeService'
  ) as any;
  return service.getActivities(employeeId);
});

export const submitActivity = createAsyncThunk<
  Activity,
  SubmitActivityRequest,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('employee/submitActivity', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IEmployeeService'
  ) as any;
  const result = await service.submitActivity(payload);
  return result.activity;
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchActivities.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load activities';
      })
      .addCase(submitActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload);
      });
  },
});

export const selectActivities = (state: RootState) =>
  state.employee?.activities ?? [];
export const selectEmployeeLoading = (state: RootState) =>
  state.employee?.loading ?? false;
export const selectEmployeeError = (state: RootState) =>
  state.employee?.error ?? null;

export default employeeSlice.reducer;
