import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import { CheckIn } from '../../types/AyskaModelsType';

interface CheckInState {
  checkIns: CheckIn[];
  loading: boolean;
  error: string | null;
}

const initialState: CheckInState = {
  checkIns: [],
  loading: false,
  error: null,
};

export const performCheckIn = createAsyncThunk<
  CheckIn,
  {
    employeeId: string;
    doctorId: string;
    location: { lat: number; lng: number };
    notes?: string;
  },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkIn/performCheckIn', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('ICheckInService') as any;
  return service.performCheckIn(
    payload.employeeId,
    payload.doctorId,
    payload.location,
    payload.notes
  );
});

export const fetchEmployeeCheckIns = createAsyncThunk<
  CheckIn[],
  { employeeId: string; startDate?: string; endDate?: string },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('checkIn/fetchEmployeeCheckIns', async (payload, thunkAPI) => {
  const repo = thunkAPI.extra.serviceContainer.get('ICheckInRepository') as any;
  return repo.getByEmployee(
    payload.employeeId,
    payload.startDate,
    payload.endDate
  );
});

const checkInSlice = createSlice({
  name: 'checkIn',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(performCheckIn.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.checkIns.unshift(action.payload);
      })
      .addCase(performCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to perform check-in';
      })
      .addCase(fetchEmployeeCheckIns.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeCheckIns.fulfilled, (state, action) => {
        state.loading = false;
        state.checkIns = action.payload;
      })
      .addCase(fetchEmployeeCheckIns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch check-ins';
      });
  },
});

export const selectCheckIns = (state: RootState) =>
  state.checkIn?.checkIns ?? [];
export const selectCheckInLoading = (state: RootState) =>
  state.checkIn?.loading ?? false;
export const selectCheckInError = (state: RootState) =>
  state.checkIn?.error ?? null;

export default checkInSlice.reducer;
