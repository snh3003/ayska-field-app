import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  CreateDoctorPayload,
  Doctor,
  DoctorQueryParams,
  UpdateDoctorPayload,
} from '../../types/AyskaDoctorApiType';
import { DoctorService } from '../../services/AyskaDoctorService';

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    has_next: boolean;
  };
}

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    has_next: false,
  },
};

// Fetch doctors with pagination
export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (params: DoctorQueryParams | undefined, { rejectWithValue }) => {
    try {
      const doctorService = ServiceContainer.getInstance().get('IDoctorService') as DoctorService;
      const response = await doctorService.getDoctors(params);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch doctors';
      return rejectWithValue(message);
    }
  },
);

// Fetch doctor by ID
export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchDoctorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const doctorService = ServiceContainer.getInstance().get('IDoctorService') as DoctorService;
      const response = await doctorService.getDoctorById(id);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch doctor';
      return rejectWithValue(message);
    }
  },
);

// Create doctor
export const createDoctor = createAsyncThunk(
  'doctor/createDoctor',
  async (data: CreateDoctorPayload, { rejectWithValue }) => {
    try {
      const doctorService = ServiceContainer.getInstance().get('IDoctorService') as DoctorService;
      const response = await doctorService.createDoctor(data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to create doctor';
      return rejectWithValue(message);
    }
  },
);

// Update doctor
export const updateDoctor = createAsyncThunk(
  'doctor/updateDoctor',
  async ({ id, data }: { id: string; data: UpdateDoctorPayload }, { rejectWithValue }) => {
    try {
      const doctorService = ServiceContainer.getInstance().get('IDoctorService') as DoctorService;
      const response = await doctorService.updateDoctor(id, data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to update doctor';
      return rejectWithValue(message);
    }
  },
);

// Delete doctor
export const deleteDoctor = createAsyncThunk(
  'doctor/deleteDoctor',
  async (id: string, { rejectWithValue }) => {
    try {
      const doctorService = ServiceContainer.getInstance().get('IDoctorService') as DoctorService;
      await doctorService.deleteDoctor(id);
      return id;
    } catch (error: any) {
      const message = error.message || 'Failed to delete doctor';
      return rejectWithValue(message);
    }
  },
);

const doctorSlice = createSlice({
  name: 'doctor',
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
    // Fetch doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
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
          has_next: action.payload.has_next,
        };
        state.error = null;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch doctor by ID
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDoctor = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create doctor
    builder
      .addCase(createDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDoctor.fulfilled, (state, _action) => {
        state.loading = false;
        // Backend returns CreateDoctorResponse (message, doctor_id, name, specialization)
        // Need to fetch the full doctor list again or construct a Doctor object
        // For now, just increment pagination
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update doctor
    builder
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.doctors.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.doctors[index] = action.payload;
        }
        if (state.selectedDoctor?.id === action.payload.id) {
          state.selectedDoctor = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete doctor
    builder
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter((d) => d.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedDoctor?.id === action.payload) {
          state.selectedDoctor = null;
        }
        state.error = null;
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectDoctors = (state: RootState) => state.doctor?.doctors ?? [];
export const selectSelectedDoctor = (state: RootState) => state.doctor?.selectedDoctor ?? null;
export const selectDoctorLoading = (state: RootState) => state.doctor?.loading ?? false;
export const selectDoctorError = (state: RootState) => state.doctor?.error ?? null;
export const selectDoctorPagination = (state: RootState) =>
  state.doctor?.pagination ?? { total: 0, page: 1, size: 10, has_next: false };

export const { clearError, clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
