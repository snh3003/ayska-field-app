// Assignment Redux Slice - Complete state management for assignment operations
// Implements all assignment CRUD operations with proper error handling

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  Assignment,
  AssignmentListResponse,
  AssignmentProgressUpdate,
  AssignmentQueryParams,
  AssignmentStatusUpdate,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
} from '../../types/AyskaAssignmentApiType';

// State interface
interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
  filters: AssignmentQueryParams;
}

// Initial state
const initialState: AssignmentState = {
  assignments: [],
  currentAssignment: null,
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
export const fetchAssignments = createAsyncThunk<
  AssignmentListResponse,
  AssignmentQueryParams | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/fetchAssignments', async (params, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.getAssignments(params);
});

export const fetchAssignmentById = createAsyncThunk<
  Assignment,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/fetchAssignmentById', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.getAssignmentById(id);
});

export const createAssignment = createAsyncThunk<
  Assignment,
  CreateAssignmentPayload,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/createAssignment', async (data, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.createAssignment(data);
});

export const updateAssignment = createAsyncThunk<
  Assignment,
  { id: string; data: UpdateAssignmentPayload },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/updateAssignment', async ({ id, data }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.updateAssignment(id, data);
});

export const updateAssignmentProgress = createAsyncThunk<
  Assignment,
  { id: string; data: AssignmentProgressUpdate },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/updateAssignmentProgress', async ({ id, data }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.updateAssignmentProgress(id, data);
});

export const updateAssignmentStatus = createAsyncThunk<
  Assignment,
  { id: string; data: AssignmentStatusUpdate },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/updateAssignmentStatus', async ({ id, data }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.updateAssignmentStatus(id, data);
});

export const deleteAssignment = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/deleteAssignment', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.deleteAssignment(id);
});

export const fetchEmployeeAssignments = createAsyncThunk<
  Assignment[],
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/fetchEmployeeAssignments', async (employeeId, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.getEmployeeAssignments(employeeId);
});

// Slice
const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<AssignmentQueryParams>) => {
      state.filters = action.payload;
    },
    clearCurrentAssignment: state => {
      state.currentAssignment = null;
    },
  },
  extraReducers: builder => {
    // Fetch assignments
    builder
      .addCase(fetchAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.assignments;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          hasNext: action.payload.has_next,
        };
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assignments';
      });

    // Fetch assignment by ID
    builder
      .addCase(fetchAssignmentById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assignment';
      });

    // Create assignment
    builder
      .addCase(createAssignment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create assignment';
      });

    // Update assignment
    builder
      .addCase(updateAssignment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(
          a => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.currentAssignment?.id === action.payload.id) {
          state.currentAssignment = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update assignment';
      });

    // Update assignment progress
    builder
      .addCase(updateAssignmentProgress.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(
          a => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.currentAssignment?.id === action.payload.id) {
          state.currentAssignment = action.payload;
        }
      })
      .addCase(updateAssignmentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update assignment progress';
      });

    // Update assignment status
    builder
      .addCase(updateAssignmentStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex(
          a => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.currentAssignment?.id === action.payload.id) {
          state.currentAssignment = action.payload;
        }
      })
      .addCase(updateAssignmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update assignment status';
      });

    // Delete assignment
    builder
      .addCase(deleteAssignment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          a => a.id !== action.meta.arg
        );
        state.pagination.total -= 1;
        if (state.currentAssignment?.id === action.meta.arg) {
          state.currentAssignment = null;
        }
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete assignment';
      });

    // Fetch employee assignments
    builder
      .addCase(fetchEmployeeAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchEmployeeAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch employee assignments';
      });
  },
});

// Actions
export const { clearError, setFilters, clearCurrentAssignment } =
  assignmentSlice.actions;

// Selectors
export const selectAssignments = (state: RootState) =>
  state.assignment?.assignments ?? [];
export const selectCurrentAssignment = (state: RootState) =>
  state.assignment?.currentAssignment ?? null;
export const selectAssignmentLoading = (state: RootState) =>
  state.assignment?.loading ?? false;
export const selectAssignmentError = (state: RootState) =>
  state.assignment?.error ?? null;
export const selectAssignmentPagination = (state: RootState) =>
  state.assignment?.pagination ?? {
    total: 0,
    page: 1,
    size: 10,
    hasNext: false,
  };
export const selectAssignmentFilters = (state: RootState) =>
  state.assignment?.filters ?? {};

export default assignmentSlice.reducer;
