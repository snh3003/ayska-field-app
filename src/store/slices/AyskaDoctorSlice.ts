// Doctor Redux Slice - Complete state management for doctor operations
// Implements all doctor CRUD operations with proper error handling

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  CreateDoctorPayload,
  Doctor,
  DoctorListResponse,
  DoctorQueryParams,
  UpdateDoctorPayload,
} from '../../types/AyskaDoctorApiType';

// State interface
interface DoctorState {
  doctors: Doctor[];
  currentDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
  filters: DoctorQueryParams;
}

// Initial state
const initialState: DoctorState = {
  doctors: [],
  currentDoctor: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    hasNext: false,
  },
  filters: {},
};

// Async thunks
export const fetchDoctors = createAsyncThunk<
  DoctorListResponse,
  DoctorQueryParams | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('doctor/fetchDoctors', async (params, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IDoctorService') as any;
  return service.getDoctors(params);
});

export const fetchDoctorById = createAsyncThunk<
  Doctor,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('doctor/fetchDoctorById', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IDoctorService') as any;
  return service.getDoctorById(id);
});

export const createDoctor = createAsyncThunk<
  Doctor,
  CreateDoctorPayload,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('doctor/createDoctor', async (data, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IDoctorService') as any;
  return service.createDoctor(data);
});

export const updateDoctor = createAsyncThunk<
  Doctor,
  { id: string; data: UpdateDoctorPayload },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('doctor/updateDoctor', async ({ id, data }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IDoctorService') as any;
  return service.updateDoctor(id, data);
});

export const deleteDoctor = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('doctor/deleteDoctor', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IDoctorService') as any;
  return service.deleteDoctor(id);
});

// Slice
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<DoctorQueryParams>) => {
      state.filters = action.payload;
    },
    clearCurrentDoctor: state => {
      state.currentDoctor = null;
    },
  },
  extraReducers: builder => {
    // Fetch doctors
    builder
      .addCase(fetchDoctors.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.doctors;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          hasNext: action.payload.has_next,
        };
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctors';
      });

    // Fetch doctor by ID
    builder
      .addCase(fetchDoctorById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doctor';
      });

    // Create doctor
    builder
      .addCase(createDoctor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create doctor';
      });

    // Update doctor
    builder
      .addCase(updateDoctor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.doctors.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.currentDoctor?.id === action.payload.id) {
          state.currentDoctor = action.payload;
        }
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update doctor';
      });

    // Delete doctor
    builder
      .addCase(deleteDoctor.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter(d => d.id !== action.meta.arg);
        state.pagination.total -= 1;
        if (state.currentDoctor?.id === action.meta.arg) {
          state.currentDoctor = null;
        }
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete doctor';
      });
  },
});

// Actions
export const { clearError, setFilters, clearCurrentDoctor } =
  doctorSlice.actions;

// Selectors
export const selectDoctors = (state: RootState) => state.doctor?.doctors ?? [];
export const selectCurrentDoctor = (state: RootState) =>
  state.doctor?.currentDoctor ?? null;
export const selectDoctorLoading = (state: RootState) =>
  state.doctor?.loading ?? false;
export const selectDoctorError = (state: RootState) =>
  state.doctor?.error ?? null;
export const selectDoctorPagination = (state: RootState) =>
  state.doctor?.pagination ?? {
    total: 0,
    page: 1,
    size: 10,
    hasNext: false,
  };
export const selectDoctorFilters = (state: RootState) =>
  state.doctor?.filters ?? {};

export default doctorSlice.reducer;
