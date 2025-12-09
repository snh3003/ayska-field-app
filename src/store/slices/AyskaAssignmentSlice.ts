import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  Assignment,
  AssignmentProgressUpdate,
  AssignmentQueryParams,
  AssignmentStatusUpdate,
  CreateAssignmentPayload,
  UpdateAssignmentPayload,
} from '../../types/AyskaAssignmentApiType';
import { AssignmentService } from '../../services/AyskaAssignmentService';

interface AssignmentState {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    has_next: boolean;
  };
}

const initialState: AssignmentState = {
  assignments: [],
  selectedAssignment: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    has_next: false,
  },
};

// Fetch assignments with pagination
export const fetchAssignments = createAsyncThunk(
  'assignment/fetchAssignments',
  async (params: AssignmentQueryParams | undefined, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.getAssignments(params);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch assignments';
      return rejectWithValue(message);
    }
  },
);

// Fetch assignment by ID
export const fetchAssignmentById = createAsyncThunk(
  'assignment/fetchAssignmentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.getAssignmentById(id);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch assignment';
      return rejectWithValue(message);
    }
  },
);

// Create assignment
export const createAssignment = createAsyncThunk(
  'assignment/createAssignment',
  async (data: CreateAssignmentPayload, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.createAssignment(data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to create assignment';
      return rejectWithValue(message);
    }
  },
);

// Update assignment
export const updateAssignment = createAsyncThunk(
  'assignment/updateAssignment',
  async ({ id, data }: { id: string; data: UpdateAssignmentPayload }, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.updateAssignment(id, data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to update assignment';
      return rejectWithValue(message);
    }
  },
);

// Update assignment progress
export const updateAssignmentProgress = createAsyncThunk(
  'assignment/updateAssignmentProgress',
  async ({ id, data }: { id: string; data: AssignmentProgressUpdate }, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.updateAssignmentProgress(id, data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to update progress';
      return rejectWithValue(message);
    }
  },
);

// Update assignment status
export const updateAssignmentStatus = createAsyncThunk(
  'assignment/updateAssignmentStatus',
  async ({ id, data }: { id: string; data: AssignmentStatusUpdate }, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      const response = await assignmentService.updateAssignmentStatus(id, data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to update status';
      return rejectWithValue(message);
    }
  },
);

// Delete assignment
export const deleteAssignment = createAsyncThunk(
  'assignment/deleteAssignment',
  async (id: string, { rejectWithValue }) => {
    try {
      const assignmentService = ServiceContainer.getInstance().get(
        'IAssignmentService',
      ) as AssignmentService;
      await assignmentService.deleteAssignment(id);
      return id;
    } catch (error: any) {
      const message = error.message || 'Failed to delete assignment';
      return rejectWithValue(message);
    }
  },
);

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedAssignment: (state) => {
      state.selectedAssignment = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch assignments
    builder
      .addCase(fetchAssignments.pending, (state) => {
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
          has_next: action.payload.has_next,
        };
        state.error = null;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch assignment by ID
    builder
      .addCase(fetchAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAssignment = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create assignment
    builder
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.unshift(action.payload);
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update assignment
    builder
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update assignment progress
    builder
      .addCase(updateAssignmentProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssignmentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update assignment status
    builder
      .addCase(updateAssignmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignmentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        if (state.selectedAssignment?.id === action.payload.id) {
          state.selectedAssignment = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAssignmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete assignment
    builder
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter((a) => a.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedAssignment?.id === action.payload) {
          state.selectedAssignment = null;
        }
        state.error = null;
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectAssignments = (state: RootState) => state.assignment?.assignments ?? [];
export const selectSelectedAssignment = (state: RootState) =>
  state.assignment?.selectedAssignment ?? null;
export const selectAssignmentLoading = (state: RootState) => state.assignment?.loading ?? false;
export const selectAssignmentError = (state: RootState) => state.assignment?.error ?? null;
export const selectAssignmentPagination = (state: RootState) =>
  state.assignment?.pagination ?? { total: 0, page: 1, size: 10, has_next: false };

export const { clearError, clearSelectedAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;
