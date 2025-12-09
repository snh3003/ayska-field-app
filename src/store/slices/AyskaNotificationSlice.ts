import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ServiceContainer } from '../../di/ServiceContainer';
import {
  Notification,
  NotificationBulkReadRequest,
  NotificationQueryParams,
  NotificationStatsResponse,
} from '../../types/AyskaNotificationApiType';
import { NotificationsService } from '../../services/AyskaNotificationsService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStatsResponse | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    size: number;
    has_next: boolean;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    has_next: false,
  },
};

// Fetch notifications with pagination
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params: NotificationQueryParams | undefined, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      const response = await notificationService.getNotifications(params);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch notifications';
      return rejectWithValue(message);
    }
  },
);

// Fetch notification stats
export const fetchNotificationStats = createAsyncThunk(
  'notification/fetchNotificationStats',
  async (_: void, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      const response = await notificationService.getNotificationStats();
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to fetch notification stats';
      return rejectWithValue(message);
    }
  },
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notification/markNotificationAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      await notificationService.markNotificationAsRead(id);
      return id;
    } catch (error: any) {
      const message = error.message || 'Failed to mark notification as read';
      return rejectWithValue(message);
    }
  },
);

// Bulk mark notifications as read
export const bulkMarkAsRead = createAsyncThunk(
  'notification/bulkMarkAsRead',
  async (data: NotificationBulkReadRequest, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      const response = await notificationService.bulkMarkAsRead(data);
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to mark notifications as read';
      return rejectWithValue(message);
    }
  },
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_: void, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      await notificationService.markAllAsRead();
      return true;
    } catch (error: any) {
      const message = error.message || 'Failed to mark all notifications as read';
      return rejectWithValue(message);
    }
  },
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (id: string, { rejectWithValue }) => {
    try {
      const notificationService = ServiceContainer.getInstance().get(
        'INotificationService',
      ) as NotificationsService;
      await notificationService.deleteNotification(id);
      return id;
    } catch (error: any) {
      const message = error.message || 'Failed to delete notification';
      return rejectWithValue(message);
    }
  },
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unread_count;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          size: action.payload.size,
          has_next: action.payload.has_next,
        };
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch notification stats
    builder
      .addCase(fetchNotificationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark notification as read
    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bulk mark as read
    builder
      .addCase(bulkMarkAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkMarkAsRead.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.notification_ids.forEach((id) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            notification.read = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
        state.error = null;
      })
      .addCase(bulkMarkAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach((notification) => {
          notification.read = true;
        });
        state.unreadCount = 0;
        state.error = null;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        const notification = state.notifications.find((n) => n.id === action.payload);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        state.pagination.total -= 1;
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors with null coalescing
export const selectNotifications = (state: RootState) => state.notification?.notifications ?? [];
export const selectUnreadCount = (state: RootState) => state.notification?.unreadCount ?? 0;
export const selectNotificationStats = (state: RootState) => state.notification?.stats ?? null;
export const selectNotificationLoading = (state: RootState) => state.notification?.loading ?? false;
export const selectNotificationError = (state: RootState) => state.notification?.error ?? null;
export const selectNotificationPagination = (state: RootState) =>
  state.notification?.pagination ?? { total: 0, page: 1, size: 10, has_next: false };

export const { clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
