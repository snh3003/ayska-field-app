// Employee Redux Slice - Real API integration for employee management
// Implements employee CRUD operations with backend API calls

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceContainer } from '../../di/ServiceContainer';
import { Employee } from '../../types/AyskaModelsType';
import { PaginationParams } from '../../types/AyskaApiResponseType';

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false,
  },
};

// Get employees with pagination
export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      const response = await employeeService.getEmployees(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch employees');
    }
  }
);

// Get employee by ID
export const getEmployeeById = createAsyncThunk(
  'employees/getEmployeeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      const employee = await employeeService.getEmployeeById(id);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch employee');
    }
  }
);

// Create new employee
export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData: any, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      const employee = await employeeService.createEmployee(employeeData);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create employee');
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (
    { id, updates }: { id: string; updates: any },
    { rejectWithValue }
  ) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      const employee = await employeeService.updateEmployee(id, updates);
      return employee;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update employee');
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete employee');
    }
  }
);

// Get employee analytics
export const getEmployeeAnalytics = createAsyncThunk(
  'employees/getEmployeeAnalytics',
  async (id: string, { rejectWithValue }) => {
    try {
      const employeeService = ServiceContainer.getInstance().get(
        'IEmployeeService'
      ) as any;
      const analytics = await employeeService.getEmployeeAnalytics(id);
      return { id, analytics };
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch employee analytics'
      );
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
    setCurrentEmployee(state, action: PayloadAction<Employee>) {
      state.currentEmployee = action.payload;
    },
  },
  extraReducers: builder => {
    // Get Employees
    builder
      .addCase(getEmployees.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.page_size,
          hasNext: action.payload.has_next,
          hasPrevious: action.payload.has_previous,
        };
        state.error = null;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Employee by ID
    builder
      .addCase(getEmployeeById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
        state.error = null;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Employee
    builder
      .addCase(createEmployee.pending, state => {
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

    // Update Employee
    builder
      .addCase(updateEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(
          emp => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Employee
    builder
      .addCase(deleteEmployee.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          emp => emp.id !== action.payload
        );
        state.pagination.total -= 1;
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Employee Analytics
    builder
      .addCase(getEmployeeAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeAnalytics.fulfilled, (state, _action) => {
        state.loading = false;
        // Analytics data can be stored in currentEmployee or separate analytics state
        state.error = null;
      })
      .addCase(getEmployeeAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentEmployee, setCurrentEmployee } =
  employeeSlice.actions;
export default employeeSlice.reducer;
