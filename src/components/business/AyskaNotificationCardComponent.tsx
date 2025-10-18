import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/AyskaCardComponent';
import { Notification } from '../../types';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatRelativeTime } from '../../../utils/dateTime';
import { hapticFeedback } from '../../../utils/haptics';
import { getCardA11yProps } from '../../../utils/accessibility';

interface NotificationCardProps {
  notification: Notification;
  onPress?: (_notification: Notification) => void;
  onMarkRead?: (_notificationId: string) => void;
  style?: any;
  accessibilityHint?: string;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'visit':
      return 'location-outline';
    case 'assignment':
      return 'person-add-outline';
    case 'attendance':
      return 'time-outline';
    case 'system':
      return 'settings-outline';
    case 'alert':
      return 'warning-outline';
    default:
      return 'notifications-outline';
  }
};

const getNotificationColor = (type: Notification['type'], theme: any) => {
  switch (type) {
    case 'visit':
      return theme.primary;
    case 'assignment':
      return theme.secondary;
    case 'attendance':
      return theme.success;
    case 'system':
      return theme.info;
    case 'alert':
      return theme.warning;
    default:
      return theme.textSecondary;
  }
};

const getNotificationBgColor = (type: Notification['type'], theme: any) => {
  switch (type) {
    case 'visit':
      return theme.primaryBg;
    case 'assignment':
      return theme.secondaryBg;
    case 'attendance':
      return theme.successBg;
    case 'system':
      return theme.infoBg;
    case 'alert':
      return theme.warningBg;
    default:
      return theme.card;
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onMarkRead,
  style,
  accessibilityHint,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handlePress = () => {
    hapticFeedback.light();
    onPress?.(notification);
  };

  const handleMarkRead = () => {
    if (!notification.read) {
      hapticFeedback.light();
      onMarkRead?.(notification.id);
    }
  };

  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type, theme);
  const iconBgColor = getNotificationBgColor(notification.type, theme);

  return (
    <Card
      variant="elevated"
      onPress={handlePress}
      style={style}
      {...getCardA11yProps(notification.title, accessibilityHint)}
    >
      <TamaguiView flexDirection="row" alignItems="flex-start">
        {/* Icon */}
        <TamaguiView
          width={48}
          height={48}
          borderRadius="$md"
          justifyContent="center"
          alignItems="center"
          marginRight="$md"
          backgroundColor={iconBgColor}
        >
          <Ionicons name={iconName as any} size={24} color={iconColor} />
        </TamaguiView>

        {/* Content */}
        <TamaguiView flex={1} marginRight="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color="$text"
              fontWeight={notification.read ? '500' : '600'}
              flex={1}
            >
              {notification.title}
            </TamaguiText>
            {!notification.read && (
              <TamaguiView
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor="$primary"
                marginLeft="$sm"
              />
            )}
          </TamaguiView>

          <TamaguiText
            fontSize="$3"
            lineHeight="$5"
            color="$textSecondary"
            marginBottom="$xs"
            numberOfLines={2}
          >
            {notification.message}
          </TamaguiText>

          <TamaguiText fontSize="$2" lineHeight="$4" color="$textSecondary">
            {formatRelativeTime(notification.timestamp)}
          </TamaguiText>
        </TamaguiView>

        {/* Action Button */}
        {notification.actionable && (
          <TouchableOpacity
            onPress={handleMarkRead}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: notification.read
                ? 'transparent'
                : theme.primaryBg,
            }}
            accessible={true}
            accessibilityLabel="Mark as read"
            accessibilityHint="Double tap to mark notification as read"
            accessibilityRole="button"
          >
            <Ionicons
              name={
                notification.read
                  ? 'checkmark-circle'
                  : 'checkmark-circle-outline'
              }
              size={20}
              color={notification.read ? theme.success : theme.primary}
            />
          </TouchableOpacity>
        )}
      </TamaguiView>
    </Card>
  );
};
