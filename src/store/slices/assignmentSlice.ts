import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import { Assignment } from '../../types/models';

interface AssignmentState {
  assignments: Assignment[];
  employeeAssignments: Assignment[];
  loading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  employeeAssignments: [],
  loading: false,
  error: null,
};

export const createAssignment = createAsyncThunk<
  Assignment[],
  {
    employeeId: string;
    doctorIds: string[];
    targets: number[];
    adminId: string;
  },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/createAssignment', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.assignDoctorsToEmployee(
    payload.employeeId,
    payload.doctorIds,
    payload.targets,
    payload.adminId
  );
});

export const fetchEmployeeAssignments = createAsyncThunk<
  Assignment[],
  { employeeId: string },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/fetchEmployeeAssignments', async (payload, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAssignmentService'
  ) as any;
  return service.getEmployeeAssignments(payload.employeeId);
});

export const fetchAllAssignments = createAsyncThunk<
  Assignment[],
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/fetchAllAssignments', async (_, thunkAPI) => {
  const repo = thunkAPI.extra.serviceContainer.get(
    'IAssignmentRepository'
  ) as any;
  return repo.getAll();
});

export const updateAssignmentProgress = createAsyncThunk<
  Assignment,
  { assignmentId: string; progress: number },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('assignment/updateAssignmentProgress', async (payload, thunkAPI) => {
  const repo = thunkAPI.extra.serviceContainer.get(
    'IAssignmentRepository'
  ) as any;
  return repo.updateProgress(payload.assignmentId, payload.progress);
});

const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createAssignment.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(...action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create assignment';
      })
      .addCase(fetchEmployeeAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeAssignments = action.payload;
      })
      .addCase(fetchEmployeeAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch employee assignments';
      })
      .addCase(fetchAllAssignments.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAllAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assignments';
      })
      .addCase(updateAssignmentProgress.fulfilled, (state, action) => {
        const index = state.assignments.findIndex(
          a => a.id === action.payload.id
        );
        if (index !== -1) {
          state.assignments[index] = action.payload;
        }
        const employeeIndex = state.employeeAssignments.findIndex(
          a => a.id === action.payload.id
        );
        if (employeeIndex !== -1) {
          state.employeeAssignments[employeeIndex] = action.payload;
        }
      });
  },
});

export const selectAssignments = (state: RootState) =>
  state.assignment?.assignments ?? [];
export const selectEmployeeAssignments = (state: RootState) =>
  state.assignment?.employeeAssignments ?? [];
export const selectAssignmentLoading = (state: RootState) =>
  state.assignment?.loading ?? false;
export const selectAssignmentError = (state: RootState) =>
  state.assignment?.error ?? null;

export default assignmentSlice.reducer;
