// Notification Redux Slice - Complete state management for notification operations
// Implements all notification operations with proper error handling

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  Notification,
  NotificationBulkReadRequest,
  NotificationBulkReadResponse,
  NotificationListResponse,
  NotificationMarkAllReadResponse,
  NotificationQueryParams,
  NotificationStatsResponse,
} from '../../types/AyskaNotificationApiType';

// State interface
interface NotificationState {
  notifications: Notification[];
  currentNotification: Notification | null;
  stats: NotificationStatsResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    unreadCount: number;
    page: number;
    size: number;
    hasNext: boolean;
  };
  filters: NotificationQueryParams;
  bulkOperation: {
    loading: boolean;
    error: string | null;
  };
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  currentNotification: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    unreadCount: 0,
    page: 1,
    size: 10,
    hasNext: false,
  },
  filters: {},
  bulkOperation: {
    loading: false,
    error: null,
  },
};

// Async thunks
export const fetchNotifications = createAsyncThunk<
  NotificationListResponse,
  NotificationQueryParams | undefined,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/fetchNotifications', async (params, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.getNotifications(params);
});

export const fetchNotificationById = createAsyncThunk<
  Notification,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/fetchNotificationById', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.getNotificationById(id);
});

export const fetchNotificationStats = createAsyncThunk<
  NotificationStatsResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/fetchNotificationStats', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.getNotificationStats();
});

export const markNotificationAsRead = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/markNotificationAsRead', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.markNotificationAsRead(id);
});

export const bulkMarkAsRead = createAsyncThunk<
  NotificationBulkReadResponse,
  NotificationBulkReadRequest,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/bulkMarkAsRead', async (data, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.bulkMarkAsRead(data);
});

export const markAllAsRead = createAsyncThunk<
  NotificationMarkAllReadResponse,
  void,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/markAllAsRead', async (_, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.markAllAsRead();
});

export const deleteNotification = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notification/deleteNotification', async (id, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationService'
  ) as any;
  return service.deleteNotification(id);
});

// Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<NotificationQueryParams>) => {
      state.filters = action.payload;
    },
    clearCurrentNotification: state => {
      state.currentNotification = null;
    },
    clearBulkOperationError: state => {
      state.bulkOperation.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = {
          total: action.payload.total,
          unreadCount: action.payload.unread_count,
          page: action.payload.page,
          size: action.payload.size,
          hasNext: action.payload.has_next,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });

    // Fetch notification by ID
    builder
      .addCase(fetchNotificationById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNotification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notification';
      });

    // Fetch notification stats
    builder
      .addCase(fetchNotificationStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to fetch notification stats';
      });

    // Mark notification as read
    builder
      .addCase(markNotificationAsRead.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, _action) => {
        state.loading = false;
        const index = state.notifications.findIndex(
          n => n.id === _action.meta.arg
        );
        if (index !== -1 && state.notifications[index]) {
          state.notifications[index].read = true;
        }
        if (
          state.currentNotification?.id === _action.meta.arg &&
          state.currentNotification
        ) {
          state.currentNotification.read = true;
        }
        state.pagination.unreadCount = Math.max(
          0,
          state.pagination.unreadCount - 1
        );
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to mark notification as read';
      });

    // Bulk mark as read
    builder
      .addCase(bulkMarkAsRead.pending, state => {
        state.bulkOperation.loading = true;
        state.bulkOperation.error = null;
      })
      .addCase(bulkMarkAsRead.fulfilled, (state, action) => {
        state.bulkOperation.loading = false;
        // Update notifications in state
        action.payload.notification_ids.forEach(id => {
          const index = state.notifications.findIndex(n => n.id === id);
          if (index !== -1 && state.notifications[index]) {
            state.notifications[index].read = true;
          }
        });
        state.pagination.unreadCount = Math.max(
          0,
          state.pagination.unreadCount - action.payload.updated_count
        );
      })
      .addCase(bulkMarkAsRead.rejected, (state, action) => {
        state.bulkOperation.loading = false;
        state.bulkOperation.error =
          action.error.message || 'Failed to bulk mark notifications as read';
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.pending, state => {
        state.bulkOperation.loading = true;
        state.bulkOperation.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state, _action) => {
        state.bulkOperation.loading = false;
        // Mark all notifications as read
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.pagination.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.bulkOperation.loading = false;
        state.bulkOperation.error =
          action.error.message || 'Failed to mark all notifications as read';
      });

    // Delete notification
    builder
      .addCase(deleteNotification.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(
          n => n.id !== action.meta.arg
        );
        state.pagination.total -= 1;
        if (state.currentNotification?.id === action.meta.arg) {
          state.currentNotification = null;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete notification';
      });
  },
});

// Actions
export const {
  clearError,
  setFilters,
  clearCurrentNotification,
  clearBulkOperationError,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) =>
  state.notification?.notifications ?? [];
export const selectCurrentNotification = (state: RootState) =>
  state.notification?.currentNotification ?? null;
export const selectNotificationStats = (state: RootState) =>
  state.notification?.stats ?? null;
export const selectNotificationLoading = (state: RootState) =>
  state.notification?.loading ?? false;
export const selectNotificationError = (state: RootState) =>
  state.notification?.error ?? null;
export const selectNotificationPagination = (state: RootState) =>
  state.notification?.pagination ?? {
    total: 0,
    unreadCount: 0,
    page: 1,
    size: 10,
    hasNext: false,
  };
export const selectNotificationFilters = (state: RootState) =>
  state.notification?.filters ?? {};
export const selectBulkOperation = (state: RootState) =>
  state.notification?.bulkOperation ?? {
    loading: false,
    error: null,
  };

export default notificationSlice.reducer;
