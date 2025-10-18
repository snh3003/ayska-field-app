import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import { Doctor, Employee } from '../../types/models';

interface OnboardingState {
  employees: Employee[];
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: OnboardingState = {
  employees: [],
  doctors: [],
  loading: false,
  error: null,
};

export const onboardEmployee = createAsyncThunk<
  Employee,
  {
    name: string;
    email: string;
    age: number;
    areaOfOperation: string;
    adminId: string;
  },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('onboarding/onboardEmployee', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IOnboardingService'
  ) as any;
  return service.onboardEmployee(
    payload.name,
    payload.email,
    payload.age,
    payload.areaOfOperation,
    payload.adminId
  );
});

export const onboardDoctor = createAsyncThunk<
  Doctor,
  {
    name: string;
    age: number;
    specialization: string;
    location: { lat: number; lng: number };
    phone: string;
    adminId: string;
  },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('onboarding/onboardDoctor', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IOnboardingService'
  ) as any;
  return service.onboardDoctor(
    payload.name,
    payload.age,
    payload.specialization,
    payload.location,
    payload.phone,
    payload.adminId
  );
});

export const fetchAllEmployees = createAsyncThunk<
  Employee[],
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('onboarding/fetchAllEmployees', async (_, thunkAPI) => {
  const repo = thunkAPI.extra.serviceContainer.get(
    'IEmployeeRepository'
  ) as any;
  return repo.getAll();
});

export const fetchAllDoctors = createAsyncThunk<
  Doctor[],
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('onboarding/fetchAllDoctors', async (_, thunkAPI) => {
  const repo = thunkAPI.extra.serviceContainer.get('IDoctorRepository') as any;
  return repo.getAll();
});

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(onboardEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onboardEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(onboardEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to onboard employee';
      })
      .addCase(onboardDoctor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onboardDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.push(action.payload);
      })
      .addCase(onboardDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to onboard doctor';
      })
      .addCase(fetchAllEmployees.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      .addCase(fetchAllDoctors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      });
  },
});

export const selectEmployees = (state: RootState) =>
  state.onboarding?.employees ?? [];
export const selectDoctors = (state: RootState) =>
  state.onboarding?.doctors ?? [];
export const selectOnboardingLoading = (state: RootState) =>
  state.onboarding?.loading ?? false;
export const selectOnboardingError = (state: RootState) =>
  state.onboarding?.error ?? null;

export default onboardingSlice.reducer;
