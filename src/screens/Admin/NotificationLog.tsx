import React, { useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchNotifications,
  markAsRead,
} from '../../store/slices/notificationsSlice';

export default function NotificationLogScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications('admin'));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotifications('admin'));
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'checkin':
        return 'checkmark-circle';
      case 'assignment':
        return 'link';
      case 'roundup':
        return 'document-text';
      case 'system':
        return 'settings';
      case 'alert':
        return 'warning';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'checkin':
        return '#4CAF50';
      case 'assignment':
        return '#FF9800';
      case 'roundup':
        return '#9C27B0';
      case 'system':
        return '#2196F3';
      case 'alert':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <TamaguiView
        flexDirection="row"
        alignItems="center"
        padding="$md"
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="#e0e0e0"
      >
        <TamaguiView
          onPress={() => router.back()}
          padding="$sm"
          marginRight="$sm"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TamaguiView>
        <TamaguiText fontSize="$6" fontWeight="bold" color="$text">
          Notification Log
        </TamaguiText>
      </TamaguiView>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <TamaguiView padding="$md">
          <TamaguiView backgroundColor="white" borderRadius="$md" padding="$md">
            <TamaguiView
              flexDirection="row"
              alignItems="center"
              marginBottom="$md"
            >
              <Ionicons name="notifications" size={24} color="#2196F3" />
              <TamaguiText
                fontSize="$5"
                fontWeight="bold"
                color="$text"
                marginLeft="$sm"
              >
                All Notifications
              </TamaguiText>
            </TamaguiView>

            {notifications.length === 0 ? (
              <TamaguiView alignItems="center" padding="$lg">
                <Ionicons name="notifications-outline" size={48} color="#ccc" />
                <TamaguiText
                  fontSize="$4"
                  color="$textSecondary"
                  marginTop="$sm"
                >
                  No notifications yet
                </TamaguiText>
              </TamaguiView>
            ) : (
              notifications.map(notification => (
                <TamaguiView
                  key={notification.id}
                  backgroundColor={notification.read ? '$background' : '$blue1'}
                  padding="$md"
                  borderRadius="$md"
                  marginBottom="$sm"
                  borderLeftWidth={4}
                  borderLeftColor={getNotificationColor(notification.type)}
                  onPress={() =>
                    !notification.read && handleMarkAsRead(notification.id)
                  }
                >
                  <TamaguiView flexDirection="row" alignItems="flex-start">
                    <TamaguiView
                      backgroundColor={getNotificationColor(notification.type)}
                      padding="$xs"
                      borderRadius="$sm"
                      marginRight="$sm"
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={16}
                        color="white"
                      />
                    </TamaguiView>

                    <TamaguiView flex={1}>
                      <TamaguiView
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom="$xs"
                      >
                        <TamaguiText
                          fontSize="$4"
                          fontWeight={notification.read ? 'normal' : 'bold'}
                          color="$text"
                        >
                          {notification.title}
                        </TamaguiText>
                        {!notification.read && (
                          <TamaguiView
                            width={8}
                            height={8}
                            backgroundColor="$primary"
                            borderRadius={4}
                          />
                        )}
                      </TamaguiView>

                      <TamaguiText
                        fontSize="$3"
                        color="$textSecondary"
                        marginBottom="$xs"
                      >
                        {notification.message}
                      </TamaguiText>

                      <TamaguiView
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <TamaguiText fontSize="$2" color="$textSecondary">
                          {formatDate(notification.timestamp)}
                        </TamaguiText>
                        <TamaguiView
                          backgroundColor={getNotificationColor(
                            notification.type
                          )}
                          paddingHorizontal="$xs"
                          paddingVertical={2}
                          borderRadius="$xs"
                        >
                          <TamaguiText
                            fontSize="$2"
                            color="white"
                            fontWeight="bold"
                          >
                            {notification.type.toUpperCase()}
                          </TamaguiText>
                        </TamaguiView>
                      </TamaguiView>
                    </TamaguiView>
                  </TamaguiView>
                </TamaguiView>
              ))
            )}
          </TamaguiView>
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
