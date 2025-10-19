import React, { useEffect } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { Colors, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { ToastProps } from '../../types';

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return theme.success;
      case 'error':
        return theme.error;
      case 'warning':
        return theme.warning;
      default:
        return theme.info;
    }
  };

  useEffect(() => {
    // Slide in
    translateY.value = withSpring(Spacing.lg, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 200 });

    // Auto dismiss
    const timer = setTimeout(() => {
      translateY.value = withSpring(-100, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 }, finished => {
        if (finished) {
          runOnJS(onDismiss)();
        }
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 16,
          right: 16,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderRadius: 12,
          borderLeftWidth: 4,
          backgroundColor: theme.card,
          borderLeftColor: getColor(),
          zIndex: 9999,
          ...Shadows.medium,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={getIcon()} size={24} color={getColor()} />
      <AyskaTextComponent
        color="text"
        style={{ marginLeft: 16, flex: 1 }}
        numberOfLines={2}
        variant="bodyLarge"
      >
        {message}
      </AyskaTextComponent>
    </Animated.View>
  );
}
