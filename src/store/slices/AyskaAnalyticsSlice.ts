// Analytics Redux Slice - Complete state management for analytics operations
// Implements all analytics endpoints with proper error handling

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  AssignmentAnalyticsResponse,
  CheckinAnalyticsResponse,
  DashboardResponse,
  EmployeePerformance,
  EmployeePerformanceResponse,
  KPIsResponse,
  ReportGenerateRequest,
  ReportGenerateResponse,
  SystemHealthResponse,
  TrendResponse,
} from '../../types/AyskaAnalyticsApiType';

// State interface
interface AnalyticsState {
  dashboard: DashboardResponse | null;
  kpis: KPIsResponse | null;
  employeePerformance: EmployeePerformanceResponse | null;
  individualPerformance: EmployeePerformance | null;
  assignmentAnalytics: AssignmentAnalyticsResponse | null;
  checkinAnalytics: CheckinAnalyticsResponse | null;
  dailyTrends: TrendResponse | null;
  weeklyTrends: TrendResponse | null;
  systemHealth: SystemHealthResponse | null;
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  reportGeneration: {
    loading: boolean;
    report: ReportGenerateResponse | null;
    error: string | null;
  };
}

// Initial state
const initialState: AnalyticsState = {
  dashboard: null,
  kpis: null,
  employeePerformance: null,
  individualPerformance: null,
  assignmentAnalytics: null,
  checkinAnalytics: null,
  dailyTrends: null,
  weeklyTrends: null,
  systemHealth: null,
  loading: false,
  error: null,
  selectedEmployeeId: null,
  reportGeneration: {
    loading: false,
    report: null,
    error: null,
  },
};

// Async thunks
export const fetchDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchDashboard', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getDashboard();
});

export const fetchKPIs = createAsyncThunk<
  KPIsResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchKPIs', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getKPIs();
});

export const fetchEmployeePerformance = createAsyncThunk<
  EmployeePerformanceResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchEmployeePerformance', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getEmployeePerformance();
});

export const fetchIndividualPerformance = createAsyncThunk<
  EmployeePerformance,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchIndividualPerformance', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getIndividualPerformance(id);
});

export const fetchAssignmentAnalytics = createAsyncThunk<
  AssignmentAnalyticsResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchAssignmentAnalytics', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getAssignmentAnalytics();
});

export const fetchCheckinAnalytics = createAsyncThunk<
  CheckinAnalyticsResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchCheckinAnalytics', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getCheckinAnalytics();
});

export const fetchDailyTrends = createAsyncThunk<
  TrendResponse,
  number | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchDailyTrends', async (days, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getDailyTrends(days);
});

export const fetchWeeklyTrends = createAsyncThunk<
  TrendResponse,
  number | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchWeeklyTrends', async (weeks, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getWeeklyTrends(weeks);
});

export const generateReport = createAsyncThunk<
  ReportGenerateResponse,
  ReportGenerateRequest,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/generateReport', async (data, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.generateReport(data);
});

export const fetchSystemHealth = createAsyncThunk<
  SystemHealthResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('analytics/fetchSystemHealth', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'IAnalyticsService'
  ) as any;
  return service.getSystemHealth();
});

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setSelectedEmployeeId: (state, action: PayloadAction<string | null>) => {
      state.selectedEmployeeId = action.payload;
    },
    clearReportGeneration: state => {
      state.reportGeneration = {
        loading: false,
        report: null,
        error: null,
      };
    },
  },
  extraReducers: builder => {
    // Dashboard
    builder
      .addCase(fetchDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard';
      });

    // KPIs
    builder
      .addCase(fetchKPIs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKPIs.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = action.payload;
      })
      .addCase(fetchKPIs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch KPIs';
      });

    // Employee Performance
    builder
      .addCase(fetchEmployeePerformance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeePerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.employeePerformance = action.payload;
      })
      .addCase(fetchEmployeePerformance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch employee performance';
      });

    // Individual Performance
    builder
      .addCase(fetchIndividualPerformance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndividualPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.individualPerformance = action.payload;
      })
      .addCase(fetchIndividualPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch individual performance';
      });

    // Assignment Analytics
    builder
      .addCase(fetchAssignmentAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.assignmentAnalytics = action.payload;
      })
      .addCase(fetchAssignmentAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch assignment analytics';
      });

    // Check-in Analytics
    builder
      .addCase(fetchCheckinAnalytics.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckinAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.checkinAnalytics = action.payload;
      })
      .addCase(fetchCheckinAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch check-in analytics';
      });

    // Daily Trends
    builder
      .addCase(fetchDailyTrends.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyTrends = action.payload;
      })
      .addCase(fetchDailyTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch daily trends';
      });

    // Weekly Trends
    builder
      .addCase(fetchWeeklyTrends.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyTrends = action.payload;
      })
      .addCase(fetchWeeklyTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weekly trends';
      });

    // Generate Report
    builder
      .addCase(generateReport.pending, state => {
        state.reportGeneration.loading = true;
        state.reportGeneration.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.reportGeneration.loading = false;
        state.reportGeneration.report = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.reportGeneration.loading = false;
        state.reportGeneration.error =
          action.error.message || 'Failed to generate report';
      });

    // System Health
    builder
      .addCase(fetchSystemHealth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.systemHealth = action.payload;
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch system health';
      });
  },
});

// Actions
export const { clearError, setSelectedEmployeeId, clearReportGeneration } =
  analyticsSlice.actions;

// Selectors
export const selectDashboard = (state: RootState) =>
  state.analytics?.dashboard ?? null;
export const selectKPIs = (state: RootState) => state.analytics?.kpis ?? null;
export const selectEmployeePerformance = (state: RootState) =>
  state.analytics?.employeePerformance ?? null;
export const selectIndividualPerformance = (state: RootState) =>
  state.analytics?.individualPerformance ?? null;
export const selectAssignmentAnalytics = (state: RootState) =>
  state.analytics?.assignmentAnalytics ?? null;
export const selectCheckinAnalytics = (state: RootState) =>
  state.analytics?.checkinAnalytics ?? null;
export const selectDailyTrends = (state: RootState) =>
  state.analytics?.dailyTrends ?? null;
export const selectWeeklyTrends = (state: RootState) =>
  state.analytics?.weeklyTrends ?? null;
export const selectSystemHealth = (state: RootState) =>
  state.analytics?.systemHealth ?? null;
export const selectAnalyticsLoading = (state: RootState) =>
  state.analytics?.loading ?? false;
export const selectAnalyticsError = (state: RootState) =>
  state.analytics?.error ?? null;
export const selectSelectedEmployeeId = (state: RootState) =>
  state.analytics?.selectedEmployeeId ?? null;
export const selectReportGeneration = (state: RootState) =>
  state.analytics?.reportGeneration ?? {
    loading: false,
    report: null,
    error: null,
  };

export default analyticsSlice.reducer;
