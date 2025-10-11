import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { View as TamaguiView, Text as TamaguiText } from '@tamagui/core'

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const { width } = Dimensions.get('window');

export function Toast({ message, type = 'info', duration = 3000, onDismiss }: ToastProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'close-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return theme.success;
      case 'error': return theme.error;
      case 'warning': return theme.warning;
      default: return theme.info;
    }
  };

  useEffect(() => {
    // Slide in
    translateY.value = withSpring(Spacing.lg, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 200 });

    // Auto dismiss
    const timer = setTimeout(() => {
      translateY.value = withSpring(-100, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(onDismiss)();
        }
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderLeftColor: getColor(),
        },
        Shadows.medium,
        animatedStyle,
      ]}
    >
      <Ionicons name={getIcon()} size={24} color={getColor()} />
      <Text
        style={[
          Typography.body,
          {
            color: theme.text,
            marginLeft: Spacing.md,
            flex: 1,
          },
        ]}
        numberOfLines={2}
      >
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    zIndex: 9999,
  },
});

