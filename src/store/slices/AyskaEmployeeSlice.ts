import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  EmployeeCreatePayload,
  EmployeeListParams,
  EmployeeResponse,
  EmployeeUpdatePayload,
} from '../../types/AyskaEmployeeApiType';
import { EmployeeService } from '../../services/AyskaEmployeeService';

interface EmployeeState {
  employees: EmployeeResponse[];
  selectedEmployee: EmployeeResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    has_next: boolean;
  };
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    has_next: false,
  },
};

// Fetch employees with pagination
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (params: EmployeeListParams | undefined, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      const response = await employeeService.getEmployees(params);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch employees';
      return rejectWithValue(message);
    }
  },
);

// Fetch employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchEmployeeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      const response = await employeeService.getEmployeeById(id);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch employee';
      return rejectWithValue(message);
    }
  },
);

// Create employee
export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (data: EmployeeCreatePayload, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      const response = await employeeService.createEmployee(data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to create employee';
      return rejectWithValue(message);
    }
  },
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employee/updateEmployee',
  async ({ id, data }: { id: string; data: EmployeeUpdatePayload }, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      const response = await employeeService.updateEmployee(id, data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to update employee';
      return rejectWithValue(message);
    }
  },
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error: any) {
      const message = error.message || 'Failed to delete employee';
      return rejectWithValue(message);
    }
  },
);

// Reactivate employee
export const reactivateEmployee = createAsyncThunk(
  'employee/reactivateEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService',
      ) as EmployeeService;
      const response = await employeeService.reactivateEmployee(id);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to reactivate employee';
      return rejectWithValue(message);
    }
  },
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch employees
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          has_next: action.payload.has_next,
        };
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch employee by ID
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create employee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update employee
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete employee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reactivate employee
    builder
      .addCase(reactivateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
        state.error = null;
      })
      .addCase(reactivateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectEmployees = (state: RootState) => state.employee?.employees ?? [];
export const selectSelectedEmployee = (state: RootState) =>
  state.employee?.selectedEmployee ?? null;
export const selectEmployeeLoading = (state: RootState) => state.employee?.loading ?? false;
export const selectEmployeeError = (state: RootState) => state.employee?.error ?? null;
export const selectEmployeePagination = (state: RootState) =>
  state.employee?.pagination ?? { total: 0, page: 1, size: 10, has_next: false };

export const { clearError, clearSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
